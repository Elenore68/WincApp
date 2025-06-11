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
    <div className="category-filter-container">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
