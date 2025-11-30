import { useEffect, useState } from "react";
import { getAnnouncements } from "../api/StudentAnnouncement"; 
import "../styles/StudentNotice.css";

interface Announcement {
  noticeId: number;
  classTitle: string;
  teacherName: string;
  title: string;
  content: string;
  noticeType: "COMMON" | "CANCELED" | "CHANGE";
  createdAt: string;
}

export function StudentNotice() {
  const [list, setList] = useState<Announcement[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getAnnouncements();
      setList(data);
    }
    load();
  }, []);

  const getTypeStyle = (type: string) => {
    if (type === "CANCELED") {
      return {
        icon: "❗",
        tag: "휴강",
        color: "#E74C3C",
        bg: "#FDEDEC",
      };
    }
    else if (type === "CHANGE"){
      return {
        icon: "ℹ️",
        tag: "일정 변경",
        color: "#e79d3cff",
        gb: "#FDEDEC"
      }
    }
    return {
      icon: "ℹ️",
      tag: "공지",
      color: "#3498DB",
      bg: "#EBF5FB",
    };
  };

  return (
    <div className="notice-container">
      <h2 className="notice-title">공지사항</h2>

      {list.map((item) => {
        const style = getTypeStyle(item.noticeType);

        return (
          <div className="notice-card" key={item.noticeId}>
            {/* 헤더 */}
            <div className="notice-header">
              <div className="notice-header-left">
                <span className="notice-icon" style={{ color: style.color }}>
                  {style.icon}
                </span>
                <span className="notice-header-title">{item.title}</span>
              </div>

              <span
                className="notice-tag"
                style={{ backgroundColor: style.bg, color: style.color }}
              >
                {style.tag}
              </span>
            </div>

            {/* 내용 */}
            <p className="notice-class">{item.classTitle}</p>
            <p className="notice-content">{item.content}</p>

            <p className="notice-date">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
