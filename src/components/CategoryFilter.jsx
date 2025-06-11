import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';
import '../Auth.css';

const CategoryFilter = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollectionRef = collection(db, "categories");
      const categorySnapshot = await getDocs(categoriesCollectionRef);
      const categoryList = categorySnapshot.docs.map(doc => doc.data().Name);
      setCategories(['All', ...categoryList]);
    };
    fetchCategories();
  }, []);

  return (
    <div className="category-filter-container" style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', width: '100vw', maxWidth: '100vw', gap: 4, padding: '0 12px 8px 12px', boxSizing: 'border-box' }}>
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
          style={{ flex: '0 0 auto', minWidth: 100, marginLeft: 0, marginRight: 0 }}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
