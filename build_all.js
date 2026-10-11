const { execSync } = require('child_process');
const path = require('path');

const folders = [
  'TEMPLATE_EXAM_STARTER',
  'already_set_questions/Q1_Book_Ecommerce_Roll_24-30',
  'already_set_questions/Q2_Doctor_Appointment_Roll_31-38',
  'already_set_questions/Q3_Expense_Tracker_Roll_39-45',
  'already_set_questions/Q4_Daily_Task_Manager_Roll_46-51_70',
  'already_set_questions/Q5_Discussion_Forum_Roll_52-59',
  'already_set_questions/Q6_Teacher_Student_Dashboard_Roll_61-67',
  'already_set_questions/Q7_Product_User_Management',
  'already_set_questions/Q8_Team_Member_Directory',
  'already_set_questions/Q9_Patient_Management'
];

console.log('Building production Vite bundles for all 10 frontend projects...\n');

let passed = 0;
let failed = 0;

folders.forEach(f => {
  const fPath = path.join(__dirname, f, 'frontend');
  process.stdout.write(`Building [${f}] ... `);
  try {
    execSync('npx vite build', { cwd: fPath, stdio: 'pipe' });
    console.log('✅ BUILT');
    passed++;
  } catch (err) {
    console.log('❌ FAILED: ' + (err.stderr ? err.stderr.toString() : err.message));
    failed++;
  }
});

console.log(`\nBuild Summary: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All 10 frontends compiled successfully with Vite!');
}
