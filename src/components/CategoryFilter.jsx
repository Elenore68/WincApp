import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';
import '../Auth.css';

const CategoryFilter = ({ onSelectCategory, selectedCategory, categories: passedCategories }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // If categories are passed as props, use them
    if (passedCategories && passedCategories.length > 0) {
      const categoryNames = passedCategories.map(cat => cat.Name);
      setCategories(['All', ...categoryNames]);
    } else {
      // Otherwise fetch them independently
      const fetchCategories = async () => {
        try {
          const categoriesCollectionRef = collection(db, "categories");
          const categorySnapshot = await getDocs(categoriesCollectionRef);
          const categoryList = categorySnapshot.docs.map(doc => doc.data().Name);
          setCategories(['All', ...categoryList]);
        } catch (error) {
          console.error('Error fetching categories:', error);
          setCategories(['All']); // Fallback to just "All"
        }
      };
      fetchCategories();
    }
  }, [passedCategories]);

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
