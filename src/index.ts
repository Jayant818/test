import express from 'express';

const app = express();

app.get('/test', (req, res) => {
  console.log('Route Hit');
  res.send("Test conifirmed");
});

app.get('test2', (req, res) => {
  res.send('Test conifirmed2');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
