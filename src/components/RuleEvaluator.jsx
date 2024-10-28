import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RuleEvaluator.css';

function RuleEvaluator({ selectedRule, onEvaluate }) {
    const [data, setData] = useState({
        age: '',
        department: '',
        salary: '',
        experience: ''
    });
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rules, setRules] = useState([]);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/rules');
            setRules(response.data);
        } catch (error) {
            console.error('Error fetching rules:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: name === 'department' ? value : value === '' ? '' : Number(value)
        }));
    };

    const handleEvaluate = async () => {
        if (!selectedRule) return;
        
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/api/rules/evaluate', {
                ruleId: selectedRule._id,
                parameters: data
            });
            setEvaluationResult(response.data);
        } catch (error) {
            console.error('Evaluation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setData({
            age: '',
            department: '',
            salary: '',
            experience: ''
        });
        setEvaluationResult(null);
    };

    return (
        <div className="evaluator-container">
            <div className="evaluator-card">
                <h2 className="evaluator-title">Rule Evaluator</h2>
                
                {selectedRule ? (
                    <>
                        <div className="selected-rule-info">
                            <h3>{selectedRule.name}</h3>
                            <p className="rule-string">{selectedRule.ruleString}</p>
                        </div>

                        <div className="input-grid">
                            <div className="input-group">
                                <label htmlFor="age">Age</label>
                                <input
                                    id="age"
                                    type="number"
                                    name="age"
                                    value={data.age}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Enter age"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="department">Department</label>
                                <select
                                    id="department"
                                    name="department"
                                    value={data.department}
                                    onChange={handleInputChange}
                                    className="select-field"
                                >
                                    <option value="">Select Department</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="HR">HR</option>
                                    <option value="Finance">Finance</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label htmlFor="salary">Salary</label>
                                <input
                                    id="salary"
                                    type="number"
                                    name="salary"
                                    value={data.salary}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Enter salary"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="experience">Experience (years)</label>
                                <input
                                    id="experience"
                                    type="number"
                                    name="experience"
                                    value={data.experience}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Enter years of experience"
                                />
                            </div>
                        </div>

                        <div className="button-group">
                            <button 
                                className="button evaluate-btn"
                                onClick={handleEvaluate}
                                disabled={loading}
                            >
                                {loading ? 'Evaluating...' : 'Evaluate Rule'}
                            </button>
                            <button 
                                className="button reset-btn"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>

                        {evaluationResult && (
                            <div className={`result-card ${evaluationResult.result ? 'success' : 'error'}`}>
                                <h3>Evaluation Result</h3>
                                <p className="result-text">
                                    {evaluationResult.result ? 'Eligible ✓' : 'Not Eligible ✗'}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-rule-selected">
                        <p>Please select a rule to evaluate</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RuleEvaluator;