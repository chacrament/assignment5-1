import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "https://6915287984e8bd126af8d70f.mockapi.io/courses";

function CreatePage() {
  const nav = useNavigate();

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [credits, setCredits] = useState("");
  const [level, setLevel] = useState("");

  const codeRef = useRef(null);
  const titleRef = useRef(null);
  const instRef = useRef(null);
  const creditRef = useRef(null);
  const levelRef = useRef(null);

  const [error, setError] = useState("");

  function validate(ref, value) {
    if (!value || !value.toString().trim()) {
      ref.current?.classList.add("is-invalid");
      return false;
    }
    ref.current?.classList.remove("is-invalid");
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const okCode = validate(codeRef, code);
    const okTitle = validate(titleRef, title);
    const okInst = validate(instRef, instructor);
    const okCredits = validate(creditRef, credits);
    const okLevel = validate(levelRef, level);

    if (!(okCode && okTitle && okInst && okCredits && okLevel)) {
      setError("빨간 표시가 된 칸을 다시 확인해 주세요.");
      return;
    }

    const newCourse = {
      code: code.trim(),
      title: title.trim(),
      instructor: instructor.trim(),
      credits: Number(credits),
      level,
    };

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });

      if (!res.ok) throw new Error("저장 실패");

      nav("/list");
    } catch (err) {
      console.error(err);
      setError("서버에 저장하는 중 오류가 발생했습니다.");
    }
  }

  return (
    <div>
      <h1>Create Course</h1>
      <p className="muted">
        새 과목 정보를 입력한 뒤 <strong>저장</strong> 버튼을 누르면 서버에 추가됩니다.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Code</label>
          <input
            ref={codeRef}
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="예: CSEE101"
          />
          <div className="invalid-feedback">과목 코드를 입력해주세요.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            ref={titleRef}
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: Introduction to Programming"
          />
          <div className="invalid-feedback">과목명을 입력해주세요.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Instructor</label>
          <input
            ref={instRef}
            className="form-control"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            placeholder="예: Prof. Kim"
          />
          <div className="invalid-feedback">담당 교수를 입력해주세요.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Credits</label>
          <input
            ref={creditRef}
            type="number"
            className="form-control"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            placeholder="예: 3"
          />
          <div className="invalid-feedback">학점을 입력해주세요.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Level</label>
          <select
            ref={levelRef}
            className="form-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">선택하세요</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <div className="invalid-feedback">수업 수준을 선택해주세요.</div>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          저장
        </button>
        <Link to="/list" className="btn btn-secondary">
          목록으로
        </Link>
      </form>
    </div>
  );
}

export default CreatePage;
