
// @author: Violet(Yafan) Zeng

const sql = require('mssql');
const express = require('express');
const app = express();
const path = require('path');


const config = {
  user: 'dbusr36261',
  password: 'w4ARyVVw**5}&#SB',
  server: 'i4pd-db0036261-001.database.windows.net',
  database: 'i4pd-db0036261-001-userdata',
};


app.get('/data', async (req, res) => {
  try {
    await sql.connect(config);

    const result = await sql.query('SELECT * FROM dbo.V000000694387'); // Updated table name

    const dataArray = result.recordset;
    res.send(dataArray);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error retrieving data from SQL Server.');
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
  res.send('Hello World!');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// // Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

