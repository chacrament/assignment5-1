import React, { useEffect, useState } from "react";

const API_BASE = "https://6915287984e8bd126af8d70f.mockapi.io/courses";

function ShowList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    code: "",
    title: "",
    instructor: "",
    credits: "",
    level: "",
  });

  async function req(url, options) {
    const res = await fetch(url, { cache: "no-store", ...options });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText}\n${text}`);
    }
    return res;
  }

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await req(API_BASE);
      const data = await res.json();
      data.sort((a, b) => Number(a.id) - Number(b.id));
      setCourses(data);
    } catch (e) {
      console.error(e);
      setError("목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ code: "", title: "", instructor: "", credits: "", level: "" });
    setShowModal(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      code: course.code ?? "",
      title: course.title ?? "",
      instructor: course.instructor ?? "",
      credits: course.credits ?? "",
      level: course.level ?? "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await req(`${API_BASE}/${id}`, { method: "DELETE" });
      await fetchCourses();
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      code: form.code.trim(),
      title: form.title.trim(),
      instructor: form.instructor.trim(),
      credits: Number(form.credits),
      level: form.level,
    };

    if (
      !payload.code ||
      !payload.title ||
      !payload.instructor ||
      !payload.credits ||
      !payload.level
    ) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }

    try {
      if (editing) {
        await req(`${API_BASE}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await req(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setShowModal(false);
      await fetchCourses();
    } catch (e) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>Courses CRUD (React)</h1>
      <p className="text-muted">
        API: <code>{API_BASE}</code>
      </p>

      <button className="btn btn-primary mb-3" onClick={openCreate}>
        새 과목 추가
      </button>

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2 className="h4">과목 목록</h2>
      <table className="table table-bordered table-sm">
        <thead className="table-light">
          <tr>
            <th style={{ width: "70px" }}>ID</th>
            <th>Code</th>
            <th>Title</th>
            <th>Instructor</th>
            <th style={{ width: "90px" }}>Credits</th>
            <th style={{ width: "130px" }}>Level</th>
            <th style={{ width: "180px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.code}</td>
              <td>{c.title}</td>
              <td>{c.instructor}</td>
              <td>{c.credits}</td>
              <td>{c.level}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => openEdit(c)}
                >
                  수정
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(c.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
          {courses.length === 0 && !loading && (
            <tr>
              <td colSpan="7">데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editing ? `과목 수정 (ID: ${editing.id})` : "새 과목 추가"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">Code</label>
                        <input
                          name="code"
                          className="form-control"
                          value={form.code}
                          onChange={handleChange}
                          placeholder="예: CSEE101"
                          required
                        />
                      </div>
                      <div className="col-md-8">
                        <label className="form-label">Title</label>
                        <input
                          name="title"
                          className="form-control"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="예: Intro to C++"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Instructor</label>
                        <input
                          name="instructor"
                          className="form-control"
                          value={form.instructor}
                          onChange={handleChange}
                          placeholder="예: Kim"
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Credits</label>
                        <input
                          type="number"
                          name="credits"
                          min="1"
                          max="5"
                          className="form-control"
                          value={form.credits}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Level</label>
                        <select
                          name="level"
                          className="form-select"
                          value={form.level}
                          onChange={handleChange}
                          required
                        >
                          <option value="">선택</option>
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      취소
                    </button>
                    <button type="submit" className="btn btn-primary">
                      저장
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default ShowList;
