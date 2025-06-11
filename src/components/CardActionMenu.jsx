import React from "react";
import { IoMdShareAlt } from "react-icons/io";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import "./CardActionMenu.css";

export function CardActionMenu({ onEdit, onDelete, onShare }) {
  return (
    <div className="card-action-menu">
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