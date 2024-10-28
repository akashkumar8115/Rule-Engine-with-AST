import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RuleForm.css';

function RuleForm({ onSubmit }) {
    const [ruleName, setRuleName] = useState('');
    const [ruleString, setRuleString] = useState('');
    const [parameters, setParameters] = useState([{ key: '', value: '' }]);
    const [rules, setRules] = useState([]);
    const [selectedRules, setSelectedRules] = useState([]);
    const [combinedRuleString, setCombinedRuleString] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ruleData = {
            ruleName,
            ruleString,
            parameters: parameters.reduce((acc, param) => {
                acc[param.key] = param.value;
                return acc;
            }, {})
        };

        try {
            const response = await axios.post('http://localhost:5001/api/rules/create', ruleData);
            onSubmit(response.data);
            fetchRules(); // Refresh rules list
            resetForm();
        } catch (error) {
            console.error('Error creating rule:', error);
        }
    };

    const handleCombineRules = async () => {
        if (selectedRules.length < 2) return;

        try {
            const response = await axios.post('http://localhost:5001/api/rules/combine', {
                ruleIds: selectedRules
            });
            setCombinedRuleString(response.data.combinedRule);
            fetchRules(); // Refresh rules list
        } catch (error) {
            console.error('Error combining rules:', error);
        }
    };

    const resetForm = () => {
        setRuleName('');
        setRuleString('');
        setParameters([{ key: '', value: '' }]);
    };

    const handleParameterChange = (index, field, value) => {
        const updatedParameters = [...parameters];
        updatedParameters[index][field] = value;
        setParameters(updatedParameters);
    };
    const addParameter = () => {
        setParameters([...parameters, { key: '', value: '' }]);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="rule-form">
                {/* Existing form fields */}
                <div>
                    <label htmlFor="ruleName">Rule Name:</label>
                    <input
                        type="text"
                        id="ruleName"
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        required
                        placeholder="Enter Rule Name"
                    />
                </div>
                <div>
                    <label htmlFor="ruleString">Rule String:</label>
                    <input
                        type="text"
                        id="ruleString"
                        value={ruleString}
                        onChange={(e) => setRuleString(e.target.value)}
                        required
                        placeholder="eg. (age > 30 AND department = 'Sales') OR (salary > 50000)"
                    />
                </div>
                {parameters.map((param, index) => (
                    <div key={index} className="parameter-group">
                        <input
                            type="text"
                            value={param.key}
                            onChange={(e) => handleParameterChange(index, 'key', e.target.value)}
                            placeholder="Parameter key"
                            required
                        />
                        <input
                            type="text"
                            value={param.value}
                            onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
                            placeholder="Parameter value"
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addParameter}>Add Parameter</button>
                <button type="submit">Create Rule</button>
            </form>

            <div className="rules-list">
                <h3>Existing Rules</h3>
                <div className="rules-container">
                    {rules.map(rule => (
                        <div key={rule._id} className="rule-item">
                            <input
                                type="checkbox"
                                checked={selectedRules.includes(rule._id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedRules([...selectedRules, rule._id]);
                                    } else {
                                        setSelectedRules(selectedRules.filter(id => id !== rule._id));
                                    }
                                }}
                            />
                            <span>ID: {rule._id}</span>
                            <span>Name: {rule.ruleName}</span>
                            <span>Rule: {rule.ruleString}</span>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleCombineRules}
                    disabled={selectedRules.length < 2}
                >
                    Combine Selected Rules
                </button>
                {combinedRuleString && (
                    <div className="combined-rule">
                        <h4>Combined Rule:</h4>
                        <p>{combinedRuleString}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RuleForm;