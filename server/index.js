require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sequelize = require('./config/database');
const Patient = require('./models/Patient');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL, 
        methods: ["GET", "POST", "PUT", "DELETE"],
        transports: ['websocket', 'polling'] // Ensure compatibility
    }
});

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'patient-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

const SECRET_KEY = process.env.JWT_SECRET || "monitoring-secret-key-dev";

// --- Database Sync & Seed ---
const seedData = async () => {
    try {
        await sequelize.sync({ alter: true }); // Changed to alter: true to apply schema changes
        // Check if users exist before seeding
        const count = await User.count();
        if (count === 0) {
            console.log("Seeding default users...");
            const hashedPassword = await bcrypt.hash("password123", 10);
            await User.bulkCreate([
                { username: "doc1", password: hashedPassword, name: "Dr. Smith", role: "Doctor" },
                { username: "nurse1", password: hashedPassword, name: "Nurse Joy", role: "Nurse" },
            ]);
        }
        console.log("Database synced");

        // Seed Patients (only if no patients exist)
        const patientCount = await Patient.count();
        if (patientCount === 0) {
            console.log("Seeding default patients...");
            await Patient.bulkCreate([
                { id: "P-101", name: "Jai Adithia", age: 35, gender: "Male", bedNumber: "ICU-001", diagnosis: "Dehydration", ivType: "0.9% NaCl", flowRate: 150, totalVolume: 1000, phoneNumber: "555-0101" },
                { id: "P-102", name: "Karthik", age: 42, gender: "Male", bedNumber: "Gen-104", diagnosis: "Post-Surgery", ivType: "Ringer Lactate", flowRate: 100, totalVolume: 500, phoneNumber: "555-0102" },
                { id: "P-103", name: "Hari dass", age: 56, gender: "Male", bedNumber: "ICU-003", diagnosis: "Infection", ivType: "Antibiotics", flowRate: 80, totalVolume: 200, phoneNumber: "555-0103" },
            ]);
            console.log("Seed data created");
        }
    } catch (err) {
        console.error("Seed error:", err);
    }
};

seedData();

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Routes ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, name, role } = req.body;
        const existing = await User.findOne({ where: { username } });
        if (existing) return res.status(400).json({ error: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            name,
            role: role || 'Nurse'
        });

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role, name: user.name }, SECRET_KEY);
    res.json({ token, user: { name: user.name, role: user.role } });
});

app.get('/api/patients', authenticateToken, async (req, res) => {
    const patients = await Patient.findAll();
    res.json(patients);
});

// Update create patient to handle file
app.post('/api/patients', authenticateToken, upload.single('photo'), async (req, res) => {
    try {
        const patientData = req.body;
        if (req.file) {
            patientData.photo = `/uploads/${req.file.filename}`;
        }
        const patient = await Patient.create(patientData);
        // Convert IDs like "age" from string to number if needed, though Sequelize handles type coercion often.
        // But better to be safe if multipart sends strings

        io.emit('patient_update', patient);
        res.status(201).json(patient);
    } catch (e) {
        console.error("Create error", e);
        res.status(400).json({ error: e.message });
    }
});

app.put('/api/patients/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await Patient.update(req.body, { where: { id } });
        const updated = await Patient.findByPk(id);
        io.emit('patient_update', updated);
        res.json(updated);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.delete('/api/patients/:id', authenticateToken, async (req, res) => {
    try { // Now allowed for both based on new requirements
        const { id } = req.params;
        await Patient.destroy({ where: { id } });
        io.emit('patient_delete', id);
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// --- ESP32 Telemetry Endpoint ---
app.post('/api/telemetry', async (req, res) => {
    try {
        const { id, flowRate, volumeInfused, status, battery } = req.body;

        // Find patient
        const patient = await Patient.findByPk(id);
        if (!patient) return res.status(404).json({ error: "Patient not found" });

        // Update fields if provided
        const updates = {};
        if (flowRate !== undefined) updates.flowRate = flowRate;
        if (volumeInfused !== undefined) updates.volumeInfused = volumeInfused;
        if (status !== undefined) updates.status = status;

        // Map simplified sensor names to model fields
        if (req.body.temp !== undefined) updates.temperature = req.body.temp;
        if (req.body.dist !== undefined) updates.distance = req.body.dist;
        if (req.body.ir !== undefined) updates.dropCount = req.body.ir;
        if (req.body.flow !== undefined) updates.flowRate = req.body.flow; // Override flowRate if 'flow' is sent

        // You might want to store battery level too ideally, but for now we just use it for logic if needed

        await patient.update(updates);

        // Broadcast real-time update
        // We broadcast the specific telemetry structure the frontend expects
        io.emit('live_data', {
            id: patient.id,
            volumeInfused: patient.volumeInfused,
            status: patient.status,
            flowRate: patient.flowRate,
            dripRate: Math.floor(patient.flowRate / 3), // Approx or send from ESP32 if available
            temperature: patient.temperature,
            distance: patient.distance,
            dropCount: patient.dropCount,
            battery: battery // Pass through if frontend handles it
        });

        res.json({ success: true });
    } catch (e) {
        console.error("Telemetry error", e);
        res.status(500).json({ error: e.message });
    }
});

// --- Simulation Logic (Server-side) ---
setInterval(async () => {
    const patients = await Patient.findAll({ where: { status: ['Normal', 'Warning'] } });

    for (const p of patients) {
        if (p.id === 'P-101') continue; // Skip Jai Adithia so ESP32 takes over entirely

        // Calculate new volume
        const flowPerSecond = p.flowRate / 3600;
        let newVolume = p.volumeInfused + flowPerSecond * 2; // 2 sec interval
        let newStatus = p.status;

        if (newVolume >= p.totalVolume) {
            newVolume = p.totalVolume;
            newStatus = 'Completed';
        } else if (newVolume >= p.totalVolume * 0.9 && newStatus === 'Normal') {
            newStatus = 'Warning';
        }

        // Random Occlusion Event (very low chance)
        if (Math.random() > 0.995 && newStatus === 'Normal') {
            newStatus = 'Critical';
        }

        if (newVolume !== p.volumeInfused || newStatus !== p.status) {
            await p.update({ volumeInfused: newVolume, status: newStatus });

            // Broadcast live data only (lightweight object)
            io.emit('live_data', {
                id: p.id,
                volumeInfused: newVolume,
                status: newStatus,
                flowRate: newStatus === 'Critical' ? 0 : p.flowRate,
                dripRate: newStatus === 'Critical' ? 0 : Math.floor(p.flowRate / 3) // Approx
            });
        }
    }
}, 2000);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
