import React, { useEffect, useRef } from "react";
import { IoMdShareAlt } from "react-icons/io";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import "./CardActionMenu.css";

export function CardActionMenu({ onEdit, onDelete, onShare, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener when menu is mounted
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup event listener when menu is unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="card-action-menu" ref={menuRef}>
      <button className="menu-btn" onClick={onEdit}>
        <MdOutlineEdit size={24} />
        <span>Edit</span>
      </button>
      <button className="menu-btn" onClick={onDelete}>
        <MdOutlineDelete size={24} />
        <span>Delete</span>
      </button>
      <button className="menu-btn" onClick={onShare}>
        <IoMdShareAlt size={24} />
        <span>Share</span>
      </button>
    </div>
  );
} 