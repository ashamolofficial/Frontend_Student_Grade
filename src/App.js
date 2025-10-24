import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ student_name: "", subject_id: "", grade: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const fetchStudents = async () => {
    const res = await axios.get(`https://backend-studentgrade.onrender.com/api/students?search=${search}&remarks=${filter}`);
    setStudents(res.data);
  };

  const fetchSubjects = async () => {
    const res = await axios.get("https://backend-studentgrade.onrender.com/api/subjects");
    setSubjects(res.data);
  };

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, [search, filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_name || !form.subject_id || !form.grade) return alert("Fill all fields");
    await axios.post("http://localhost:5000/api/students", form);
    setForm({ student_name: "", subject_id: "", grade: "" });
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/students/${id}`);
    fetchStudents();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Student Grades</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Student Name"
          value={form.student_name}
          onChange={(e) => setForm({ ...form, student_name: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={form.subject_id}
          onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.subject_name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Grade"
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
          Add
        </button>
      </form>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search Student"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Subject</th>
            <th className="border px-4 py-2">Grade</th>
            <th className="border px-4 py-2">Remarks</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td className="border px-4 py-2">{s.student_name}</td>
              <td className="border px-4 py-2">{s.subject_id?.subject_name}</td>
              <td className="border px-4 py-2">{s.grade}</td>
              <td className="border px-4 py-2">{s.remarks}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleDelete(s._id)} className="bg-red-500 text-white px-2 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
