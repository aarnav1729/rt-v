import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventSelector from './components/eventSelector';
import MemberList from './components/memberList';
import SearchBar from './components/SearchBar';

// Create an Axios instance with the Render backend URL
const api = axios.create({
  baseURL: 'https://rt-vb.vercel.app/',
});

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/api/attendance/events')
      .then(res => {
        console.log('Events fetched:', res.data);
        setEvents(res.data);
      })
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      api.get('/api/attendance/members')
        .then(res => {
          console.log('Members fetched:', res.data);
          setMembers(res.data);
          loadAttendanceState(selectedEvent);
        })
        .catch(err => console.error('Error fetching members:', err));
    }
  }, [selectedEvent]);

  const loadAttendanceState = (eventId) => {
    const savedState = localStorage.getItem(`attendance_${eventId}`);
    if (savedState) {
      setAttendance(JSON.parse(savedState));
    } else {
      setAttendance({});
    }
  };

  const handleAttendanceChange = (memberId, present) => {
    const newAttendance = {
      ...attendance,
      [memberId]: present,
    };
    setAttendance(newAttendance);
    localStorage.setItem(`attendance_${selectedEvent}`, JSON.stringify(newAttendance));
  };

  const handleSubmit = () => {
    const attendanceList = members.map(member => ({
      email: member.email,
      present: attendance[member._id] || false,
    }));

    api.post('/api/attendance/mark', {
      eventId: selectedEvent,
      attendance: attendanceList,
    })
    .then(() => alert('Attendance submitted successfully!'))
    .catch(err => console.error('Error submitting attendance:', err));
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Rotary Club Attendance</h1>
        <EventSelector events={events} onSelect={setSelectedEvent} />
        <SearchBar onSearch={setSearchTerm} />
        {selectedEvent && (
          <div className="mt-4">
            <MemberList 
              members={filteredMembers} 
              attendance={attendance} 
              onAttendanceChange={handleAttendanceChange} 
            />
            <button 
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" 
              onClick={handleSubmit}
            >
              Send Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;