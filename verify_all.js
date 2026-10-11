#!/usr/bin/env node
/**
 * Automated Verification Runner for OST / Web Programming Lab Suite
 * -----------------------------------------------------------------
 * Sequentially boots all 9 question servers + Universal Template starter,
 * verifies REST API response and frontend static serving, and prints a scorecard.
 */

const cp = require('child_process');
const path = require('path');

const SUITES = [
  {
    name: 'Universal Template Starter',
    folder: 'TEMPLATE_EXAM_STARTER',
    port: 5000,
    apiEndpoint: '/api/items',
    topic: 'Master CRUD Boilerplate'
  },
  {
    name: 'Q1: Book E-Commerce',
    folder: 'already_set_questions/Q1_Book_Ecommerce_Roll_24-30',
    port: 5001,
    apiEndpoint: '/api/books',
    topic: 'Rolls 24-30: React Router, Cart & Inventory'
  },
  {
    name: 'Q2: Doctor Appointments',
    folder: 'already_set_questions/Q2_Doctor_Appointment_Roll_31-38',
    port: 5002,
    apiEndpoint: '/api/doctors',
    topic: 'Rolls 31-38: Booking & Rescheduling'
  },
  {
    name: 'Q3: Expense Tracker',
    folder: 'already_set_questions/Q3_Expense_Tracker_Roll_39-45',
    port: 5003,
    apiEndpoint: '/api/expenses',
    topic: 'Rolls 39-45: Categories & Progress Bars'
  },
  {
    name: 'Q4: Daily Task Manager',
    folder: 'already_set_questions/Q4_Daily_Task_Manager_Roll_46-51_70',
    port: 5004,
    apiEndpoint: '/api/tasks',
    topic: 'Rolls 46-51, 70: Task CRUD & Status Toggles'
  },
  {
    name: 'Q5: Discussion Forum',
    folder: 'already_set_questions/Q5_Discussion_Forum_Roll_52-59',
    port: 5005,
    apiEndpoint: '/api/posts',
    topic: 'Rolls 52-59: Context API & Upvoting'
  },
  {
    name: 'Q6: Student Gradebook',
    folder: 'already_set_questions/Q6_Teacher_Student_Dashboard_Roll_61-67',
    port: 5006,
    apiEndpoint: '/api/students',
    topic: 'Rolls 61-67: Grades, Stats & Report Cards'
  },
  {
    name: 'Q7: Product & User Management',
    folder: 'already_set_questions/Q7_Product_User_Management',
    port: 5007,
    apiEndpoint: '/api/products',
    topic: 'Dual CRUD with Regex Validations'
  },
  {
    name: 'Q8: Team Member Directory',
    folder: 'already_set_questions/Q8_Team_Member_Directory',
    port: 5008,
    apiEndpoint: '/api/members',
    topic: 'Reusable React Components & Props'
  },
  {
    name: 'Q9: Patient Management',
    folder: 'already_set_questions/Q9_Patient_Management',
    port: 5009,
    apiEndpoint: '/api/patients',
    topic: 'Health Record CRUD & Admissions'
  }
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifySuite(suite) {
  const serverPath = path.join(__dirname, suite.folder, 'backend', 'server.js');
  const child = cp.spawn(process.execPath, [serverPath], {
    cwd: path.dirname(serverPath),
    stdio: 'ignore'
  });

  try {
    let apiData = null;
    let uiOk = false;

    // Retry loop (wait up to 5 seconds for server and db readiness)
    for (let attempt = 0; attempt < 10; attempt++) {
      await sleep(500);
      try {
        const apiRes = await fetch(`http://localhost:${suite.port}${suite.apiEndpoint}`);
        if (apiRes.ok) {
          apiData = await apiRes.json();
          const uiRes = await fetch(`http://localhost:${suite.port}/`);
          if (uiRes.ok) {
            const html = await uiRes.text();
            if (html.includes('root')) {
              uiOk = true;
              break;
            }
          }
        }
      } catch (e) {
        // Server still booting, continue polling
      }
    }

    if (!apiData || !uiOk) {
      throw new Error('Server did not become ready within timeout');
    }

    const dataCount = Array.isArray(apiData) ? apiData.length : Object.keys(apiData).length;
    return { success: true, count: dataCount };
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    try {
      child.kill('SIGTERM');
      child.kill('SIGKILL');
    } catch (e) {}
    await sleep(400);
  }
}

async function runAll() {
  console.log('\n========================================================================');
  console.log('       OST / WEB PROGRAMMING LAB SUITE - AUTOMATED VERIFICATION');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const suite of SUITES) {
    process.stdout.write(`Testing [Port ${suite.port}] ${suite.name} ... `);
    const result = await verifySuite(suite);
    if (result.success) {
      passed++;
      console.log(`PASS (API Items: ${result.count})`);
      results.push({ ...suite, status: 'PASS', details: `API & UI OK (${result.count} items)` });
    } else {
      failed++;
      console.log(`FAIL (${result.error})`);
      results.push({ ...suite, status: 'FAIL', details: result.error });
    }
  }

  console.log('\n------------------------------------------------------------------------');
  console.log('                            FINAL SCORECARD');
  console.log('------------------------------------------------------------------------');
  console.table(results.map(r => ({
    Port: r.port,
    Question: r.name,
    Topic: r.topic,
    Status: r.status,
    Result: r.details
  })));

  console.log(`\nSummary: Total: ${SUITES.length} | Passed: ${passed} | Failed: ${failed}`);
  if (failed === 0) {
    console.log('🎉 ALL 10 SUITES (Q1-Q9 + TEMPLATE) ARE 100% OPERATIONAL & READY!\n');
    process.exit(0);
  } else {
    console.error('⚠️ Some suites encountered issues. Review details above.\n');
    process.exit(1);
  }
}

runAll();
