require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// =========================
// MongoDB Connection
// =========================

mongoose.connect(process.env.MONGO_URI)
    .then(function () {
        console.log("MongoDB Connected");
    })
    .catch(function (err) {
        console.error("MongoDB Connection Error:", err.message);
    });

// =========================
// Student Schema
// =========================

const studentSchema = new mongoose.Schema({
    studentId: String,

    name: String,

    registration: String,

    course: String,

    rollNumber: String,

    qualification: String,

    enrollmentNumber: String,

    validationPeriod: String,

    academicSession: String,

    specialization: String,

    status: String,

    email: String,

    phone: String
});

const Student = mongoose.model("Student", studentSchema);

// =========================
// Get All Students
// =========================

app.get("/students", function (req, res) {

    Student.find({})
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            console.log(err);

            res.status(500).json({
                message: "Server Error"
            });
        });

});

// =========================
// Student Verification
// Search by:
// 1. Registration Number
// 2. Enrollment Number
// 3. Roll Number
// =========================

app.get("/student/:verificationNumber", function (req, res) {

    const verificationNumber =
        req.params.verificationNumber.trim();

    Student.findOne({
        $or: [
            {
                registration: verificationNumber
            },
            {
                enrollmentNumber: verificationNumber
            },
            {
                rollNumber: verificationNumber
            }
        ]
    })
        .select({
            rollNumber: 1,
            name: 1,
            course: 1,
            qualification: 1,
            status: 1,
            enrollmentNumber: 1,
            validationPeriod: 1,
            _id: 0
        })
        .then(function (student) {

            if (student) {

                res.json(student);

            } else {

                res.status(404).json({
                    message: "Student Not Found"
                });

            }

        })
        .catch(function (err) {

            console.log(err);

            res.status(500).json({
                message: "Server Error"
            });

        });

});

// =========================
// Apply / Register Student
// =========================

app.post("/apply", function (req, res) {

    const enrollmentNumber = req.body.enrollment;

    Student.findOne({
        $or: [
            {
                registration: enrollmentNumber
            },
            {
                enrollmentNumber: enrollmentNumber
            }
        ]
    })
        .then(function (existingStudent) {

            if (existingStudent) {

                return res.status(400).json({
                    message: "Registration Already Exists"
                });

            }

            const student = new Student({

                studentId:
                    "VTU" +
                    Math.floor(
                        1000 + Math.random() * 9000
                    ),

                name: req.body.name,

                registration: enrollmentNumber,

                enrollmentNumber: enrollmentNumber,

                rollNumber: req.body.rollNumber,

                course: req.body.course,

                qualification:
                    req.body.qualification || "",

                validationPeriod:
                    req.body.validationPeriod || "",

                academicSession:
                    req.body.academicSession || "",

                specialization:
                    req.body.specialization || "Computer Science",

                status:
                    req.body.status || "RESULT PASS",

                email:
                    req.body.email || "",

                phone:
                    req.body.phone || ""

            });

            student.save()
                .then(function () {

                    res.send("Application Submitted");

                })
                .catch(function (err) {

                    console.log(err);

                    res.status(500).send(err);

                });

        })
        .catch(function (err) {

            console.log(err);

            res.status(500).json({
                message: "Server Error"
            });

        });

});

// =========================
// Home
// =========================

app.get("/", function (req, res) {

    res.send("Welcome to VTU backend");

});

// =========================
// Start Server
// =========================

app.listen(port, function () {

    console.log(
        `Server Started on port ${port}`
    );

});