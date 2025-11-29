import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "https://6915287984e8bd126af8d70f.mockapi.io/courses";

async function req(url, options) {
  const res = await fetch(url, { cache: "no-store", ...options });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}\n${text}`);
  }
  return res;
}

function ListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await req(`${API_BASE}/${id}`, { method: "DELETE" });
      await fetchCourses();
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>Course List</h1>
      <p className="muted">
        API: <code>{API_BASE}</code>
      </p>

      <Link to="/create" className="btn btn-primary mb-3">
        새 과목 추가하기
      </Link>

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="table table-bordered table-sm">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Title</th>
            <th>Instructor</th>
            <th>Credits</th>
            <th>Level</th>
            <th>Actions</th>
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
                <Link
                  to={`/detail/${c.id}`}
                  className="btn btn-sm btn-outline-secondary me-2"
                >
                  상세
                </Link>
                <Link
                  to={`/update/${c.id}`}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  수정
                </Link>
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
    </div>
  );
}

export default ListPage;
