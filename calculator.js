const express = require('express');
const path = require('path');
const {check} = require("express-validator");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.route('/bmicalculator') [check('age').isInt({ min: 2, max: 120 })]
    .get((req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'calculatorBMI.html'));
    })
    .post((req, res) => {
        const {age, gender, weight, height, units} = req.body;
        if (!age || !gender || !weight || !height || !units) {
            return res.status(400).send('Invalid input. Please provide all required fields.');
        }
        let heightInMeters, weightInKg;

        if (units === 'metric') {
            heightInMeters = height / 100;
            weightInKg = weight;
        } else if (units === 'imperial') {
            heightInMeters = height * 0.0254;
            weightInKg = weight * 0.453592;
        } else {
            return res.status(400).send('Invalid unit type. Please provide "metric" or "imperial".');
        }

        const bmi = weightInKg / (heightInMeters * heightInMeters);

        let classification;
        if (bmi < 18.5) {
            classification = 'Underweight';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            classification = 'Normal weight';
        } else if (bmi >= 25 && bmi < 29.9) {
            classification = 'Overweight';
        } else {
            classification = 'Obese';
        }

        res.json({ BMI: bmi, Classification: classification });
    });

app.get('/adults', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adults.html'));
});

app.get('/children', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'children.html'));
});

app.use((req, res) => {
    res.status(404).send('404: Page not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
