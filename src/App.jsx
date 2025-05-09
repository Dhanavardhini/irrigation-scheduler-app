import React, { useState } from 'react';
import './App.css';
import { generateSchedule } from "./utils/scheduler";

export default function App() {
  const [formData, setFormData] = useState({
    plots: 4,
    motors: 2,
    startTime: '060000',
    endTime: '190000',
    motorRunTime: 5,  
    interval: 20, 
  });

  const [schedule, setSchedule] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPlot, setFilterPlot] = useState('All');

  const handleGenerate = () => {
    setSchedule(generateSchedule(formData));
  };

  const now = new Date();
  const getStatus = (start, end) => {
    const s = parseTime(start);
    const e = parseTime(end);
    if (e < now) return 'Done';
    if (s <= now && now <= e) return 'In Progress';
    return 'Pending';
  };

  const parseTime = (str) => new Date(2000, 0, 1, ...str.match(/.{1,2}/g).map(Number));


  const filtered = schedule.filter((s) => {
    const status = getStatus(s.startTime, s.endTime);
    const plotMatches = filterPlot === 'All' || s.plot === filterPlot;
    const statusMatches = filterStatus === 'All' || status === filterStatus;
    return plotMatches && statusMatches;
  });

  return (
    <div className="container">
      <h1>Irrigation System</h1>
      <div className="form">
        <label>
          Number of Plots to be irrigated
          <input
            type="number"
            value={formData.plots}
            onChange={(e) => setFormData({ ...formData, plots: +e.target.value })}
          />
        </label>
        <label>
          How many motors can be run in parallel?
          <input
            type="number"
            value={formData.motors}
            onChange={(e) => setFormData({ ...formData, motors: +e.target.value })}
          />
        </label>
        <label>
          Irrigation Start Time and End Time
          <input
            type="text"
            value={`${formData.startTime} — ${formData.endTime}`}
            onChange={(e) => {
              const [start, end] = e.target.value.replace(/ /g, '').split('—');
              setFormData({ ...formData, startTime: start, endTime: end });
            }}
          />
        </label>
        <label>
          Motor Runtime (minutes)
          <input
            type="text"
            value={`${formData.motorRunTime} minutes`}
            onChange={(e) =>
              setFormData({ ...formData, motorRunTime: parseInt(e.target.value) })
            }
          />
        </label>
        <label>
          Irrigation Cycle Interval (minutes)
          <input
            type="text"
            value={`${formData.interval} minutes`}
            onChange={(e) =>
              setFormData({ ...formData, interval: parseInt(e.target.value) })
            }
          />
        </label>
        <button onClick={handleGenerate}>Generate Schedule</button>
      </div>

      
      <div className="filters">
        <label>
          Filter by Plot:
          <select value={filterPlot} onChange={(e) => setFilterPlot(e.target.value)}>
            <option value="All">All</option>
            {Array.from({ length: formData.plots }, (_, i) => (
              <option key={i} value={`D${i + 1}`}>D{i + 1}</option>
            ))}
          </select>
        </label>
        
        <label>
          Filter by Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="Done">Done</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </label>
      </div>

     
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Plot</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Motor</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row) => (
            <tr key={row.index}>
              <td>{row.index}</td>
              <td>{row.plot}</td>
              <td>{row.startTime}</td>
              <td>{row.endTime}</td>
              <td>{row.RunBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
