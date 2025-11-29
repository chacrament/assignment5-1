import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const API_BASE = "https://6915287984e8bd126af8d70f.mockapi.io/courses";

function UpdatePage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [course, setCourse] = useState(null);
  const [editCount, setEditCount] = useState(0);
  const [error, setError] = useState("");

  const codeRef = useRef(null);
  const titleRef = useRef(null);
  const instRef = useRef(null);
  const creditRef = useRef(null);
  const levelRef = useRef(null);

  useEffect(() => {
    async function fetchOne() {
      try {
        setError("");
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error("요청 실패");
        const data = await res.json();
        setCourse(data);
      } catch (e) {
        console.error(e);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    }
    fetchOne();
  }, [id]);

  function validate(ref, value) {
    if (!value || !value.toString().trim()) {
      ref.current?.classList.add("is-invalid");
      return false;
    }
    ref.current?.classList.remove("is-invalid");
    return true;
  }

  async function handleFieldChange(field, value, ref) {
    if (!course) return;

    // 화면 즉시 반영
    const updated = {
      ...course,
      [field]: field === "credits" ? Number(value) : value,
    };
    setCourse(updated);

    // 유효성 검사
    if (!validate(ref, value)) return;

    setEditCount((c) => c + 1);

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("수정 실패");
    } catch (e) {
      console.error(e);
      setError("서버에 수정사항을 저장하는 중 오류가 발생했습니다.");
    }
  }

  if (!course) {
    return <p>불러오는 중...</p>;
  }

  return (
    <div>
      <h1>Update Course</h1>
      <p className="muted">
        이 페이지에서 값을 바꾸면 <strong>입력할 때마다</strong> 바로 서버에 저장됩니다.
      </p>
      <p>
        수정 횟수: <strong>{editCount}</strong> 회
      </p>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Code</label>
        <input
          ref={codeRef}
          className="form-control"
          value={course.code || ""}
          onChange={(e) =>
            handleFieldChange("code", e.target.value, codeRef)
          }
        />
        <div className="invalid-feedback">코드를 입력해 주세요.</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          ref={titleRef}
          className="form-control"
          value={course.title || ""}
          onChange={(e) =>
            handleFieldChange("title", e.target.value, titleRef)
          }
        />
        <div className="invalid-feedback">제목을 입력해 주세요.</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Instructor</label>
        <input
          ref={instRef}
          className="form-control"
          value={course.instructor || ""}
          onChange={(e) =>
            handleFieldChange("instructor", e.target.value, instRef)
          }
        />
        <div className="invalid-feedback">담당 교수를 입력해 주세요.</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Credits</label>
        <input
          ref={creditRef}
          type="number"
          className="form-control"
          value={course.credits ?? ""}
          onChange={(e) =>
            handleFieldChange("credits", e.target.value, creditRef)
          }
        />
        <div className="invalid-feedback">학점을 입력해 주세요.</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Level</label>
        <select
          ref={levelRef}
          className="form-select"
          value={course.level || ""}
          onChange={(e) =>
            handleFieldChange("level", e.target.value, levelRef)
          }
        >
          <option value="">선택하세요</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <div className="invalid-feedback">수준을 선택해 주세요.</div>
      </div>

      <Link to="/list" className="btn btn-secondary me-2">
        목록으로
      </Link>
     
    </div>
  );
}

export default UpdatePage;
