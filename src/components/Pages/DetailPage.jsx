import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE = "https://6915287984e8bd126af8d70f.mockapi.io/courses";

function DetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOne() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error("요청 실패");
        const data = await res.json();
        setCourse(data);
      } catch (e) {
        console.error(e);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchOne();
  }, [id]);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!course) return <p>데이터가 없습니다.</p>;

  return (
    <div>
      <h1>Course Detail</h1>
      <p>
        <strong>ID:</strong> {course.id}
      </p>
      <p>
        <strong>Code:</strong> {course.code}
      </p>
      <p>
        <strong>Title:</strong> {course.title}
      </p>
      <p>
        <strong>Instructor:</strong> {course.instructor}
      </p>
      <p>
        <strong>Credits:</strong> {course.credits}
      </p>
      <p>
        <strong>Level:</strong> {course.level}
      </p>

      <Link
        to={`/update/${course.id}`}
        className="btn btn-primary me-2"
      >
        수정하러 가기
      </Link>
      <Link to="/list" className="btn btn-secondary">
        목록으로
      </Link>
    </div>
  );
}

export default DetailPage;
