const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Replace with your actual API key
const API_KEY = 'b4CpS_MvCHrIMCwZxcb8_0xuL26XCnnYYtr-WvLzIS1U98WkUHjxISkRtNqHrgcY1DDoU1q7_ZkU8yAvTZNBHg';

// Path to your Excel file
const filePath = './students.xlsx';

// Prepare the form
const formData = new FormData();
formData.append('file', fs.createReadStream(filePath));
formData.append('dialect', 'mysql'); // SQL dialect

// Request config
const config = {
  method: 'post',
  url: 'https://api.sqlizer.io/v1/convert',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    ...formData.getHeaders()
  },
  data: formData
};

// Send request
axios(config)
  .then(response => {
    console.log('SQL Output:\n', response.data.sql);
    // Optionally, save the SQL to a file
    fs.writeFileSync('output.sql', response.data.sql);
    console.log('Saved SQL to output.sql');
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message);
  });
