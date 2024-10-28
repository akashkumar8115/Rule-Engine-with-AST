import React, { useState } from 'react';
import RuleForm from './components/RuleForm';
import './App.css';
import RuleEvaluator from './components/RuleEvaluator';

function App() {
  const [ruleString, setRuleString] = useState('');
  const [data, setData] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [ruleName, setRuleName] = useState('');

  const handleRuleSubmit = async (rule, name) => {
    setRuleString(rule);
    try {
      const response = await fetch('http://localhost:5001/api/rules/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleString: rule,
          name: name,
          attributes: [
            { name: 'age', type: 'number', validations: { min: 0, max: 120 } },
            { name: 'department', type: 'string', validations: { allowedValues: ['Sales', 'Marketing', 'Engineering'] } },
            { name: 'salary', type: 'number', validations: { min: 0 } },
            { name: 'experience', type: 'number', validations: { min: 0 } }
          ]
        }),
      });
      const data = await response.json();
      console.log('Rule created:', data);
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const handleDataChange = (newData) => {
    setData(newData);
  };

  const handleEvaluateRule = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/rules/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId: '6714f5cbfe454f568ae7273b', data }),
      });
      const result = await response.json();
      setEvaluationResult(result.result);
    } catch (error) {
      console.error('Error evaluating rule:', error);
    }
  };

  return (
    <div className="container">
      <h1>Rule Engine</h1>
      <RuleForm onSubmit={handleRuleSubmit} />
      <div className="section">
        <h2>Evaluate Rule</h2>
        <div className="data-inputs">
          <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={(e) => handleDataChange({ ...data, age: Number(e.target.value) })}
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            onChange={(e) => handleDataChange({ ...data, department: e.target.value })}
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            onChange={(e) => handleDataChange({ ...data, salary: Number(e.target.value) })}
          />
          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            onChange={(e) => handleDataChange({ ...data, experience: Number(e.target.value) })}
          />
        </div>
        <button onClick={handleEvaluateRule}>Evaluate Rule</button>

        {evaluationResult !== null && (
          <div className="result">
            <h3>Evaluation Result:</h3>
            <p>{evaluationResult ? 'Eligible' : 'Not Eligible'}</p>
          </div>
        )}
      </div>
      <RuleEvaluator />
    </div>
  );
}

export default App;
