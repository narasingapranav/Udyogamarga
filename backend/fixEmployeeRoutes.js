const fs = require('fs');
const path = require('path');

const employeeFilePath = path.join(__dirname, 'src', 'routes', 'employee.js');

try {
  let content = fs.readFileSync(employeeFilePath, 'utf8');
  
  // Replace all instances of req.user.userId with req.user._id
  const updatedContent = content.replace(/req\.user\.userId/g, 'req.user._id');
  
  fs.writeFileSync(employeeFilePath, updatedContent);
  
  console.log('✅ Successfully updated employee.js file');
  console.log('🔄 Replaced all instances of req.user.userId with req.user._id');
} catch (error) {
  console.error('❌ Error updating file:', error.message);
}