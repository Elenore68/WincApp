import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import TemplateCard from '../components/TemplateCard';
import CreateCardModal from '../components/CreateCardModal';
import Logo from '../assets/logo.png';
import HeroImage from '../assets/hero.jpg';
import '../Auth.css'; // Reusing Auth.css for general app styles
import { useLocation } from 'react-router-dom';

const Main = () => {
  const location = useLocation();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [editCardData, setEditCardData] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (location.state && location.state.openEditModal) {
      setSelectedTemplateId(location.state.templateId || null);
      setEditCardData(location.state.cardData || null);
      setModalOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const templatesCollectionRef = collection(db, "templates");
      const templateSnapshot = await getDocs(templatesCollectionRef);
      const templateList = templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTemplates(templateList);
      setFilteredTemplates(templateList); // Initialize filtered templates with all templates
    };
    const fetchCategories = async () => {
      const categoriesCollectionRef = collection(db, "categories");
      const categorySnapshot = await getDocs(categoriesCollectionRef);
      const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoryList);
    };
    fetchTemplates();
    fetchCategories();
  }, []);

  useEffect(() => {
    let currentTemplates = templates;

    // Filter by category
    if (selectedCategory !== "All") {
      // Find the selected category object by name
      const selectedCategoryObj = categories.find(
        (cat) => cat.name === selectedCategory
      );
      if (selectedCategoryObj) {
        currentTemplates = currentTemplates.filter(
          (template) => template.CategoryId === selectedCategoryObj.id
        );
      } else {
        currentTemplates = [];
      }
    }

    // Filter by search term
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      currentTemplates = currentTemplates.filter(
        (template) =>
          (template.Name &&
            template.Name.toLowerCase().includes(lowercasedSearchTerm)) ||
          (template.Tags &&
            template.Tags.some((tag) =>
              tag.toLowerCase().includes(lowercasedSearchTerm)
            )) ||
          (template.Description &&
            template.Description.toLowerCase().includes(lowercasedSearchTerm))
      );
    }

    setFilteredTemplates(currentTemplates);
  }, [searchTerm, selectedCategory, templates, categories]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  // Handle plus icon click in Navbar (optional: show template selector or blank state)
  const handlePlusClick = () => {
    setSelectedTemplateId(null); // Or show a template selector in the modal
    setModalOpen(true);
  };

  return (
    <div className="main-page-container">
      <header className="main-header">
        <img src={Logo} alt="Winc Logo" className="main-logo" />
        <div className="animated-tutorial-placeholder">
          {/* Placeholder for animated images/tutorial */}
          <p>Choose a beautiful template</p>
          <p>(from a variety of themes)</p>
          <div className="animated-images-row" style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
             <img src={HeroImage} alt="Hero Visual" style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', maxWidth: 300, width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>
      </header>

      <SearchBar
        onSearch={handleSearch}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <CategoryFilter
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />

      <div className="special-card-prompt">
        <p>Looking for the perfect card? choose one below</p>
      </div>

      <div className="templates-grid">
        {filteredTemplates
          .filter((template) => template.ThumbnailUrl)
          .map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => {
                setSelectedTemplateId(template.id);
                setModalOpen(true);
              }}
            />
          ))}
      </div>

      <Navbar onPlusClick={handlePlusClick} />

      <CreateCardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        template={templates.find((t) => t.id === selectedTemplateId)} // ✅ Correct way to get the full template object
        cardData={editCardData}
      />
    </div>
  );
};

export default Main;
