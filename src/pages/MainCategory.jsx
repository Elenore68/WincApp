import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebaseConfig';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import TemplateCard from '../components/TemplateCard';
import CreateCardModal from '../components/CreateCardModal';
import Logo from '../assets/logo.png';
import '../Auth.css';

const MainCategory = () => {
  const { categoryName } = useParams();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryName || 'All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    setSelectedCategory(categoryName || 'All');
  }, [categoryName]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const templatesCollectionRef = collection(db, "templates");
      let q = templatesCollectionRef;

      if (selectedCategory !== 'All') {
        const categoriesCollectionRef = collection(db, "categories");
        const categorySnapshot = await getDocs(categoriesCollectionRef);
        const categories = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const selectedCategoryObj = categories.find(cat => cat.Name === selectedCategory);
        
        if (selectedCategoryObj) {
          q = query(templatesCollectionRef, where("CategoryId", "==", selectedCategoryObj.id));
        }
      }

      const templateSnapshot = await getDocs(q);
      const templateList = templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTemplates(templateList);
      setFilteredTemplates(templateList);
    };

    fetchTemplates();
  }, [selectedCategory]);

  useEffect(() => {
    let currentTemplates = templates;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      currentTemplates = currentTemplates.filter(template =>
        (template.Name && template.Name.toLowerCase().includes(lowercasedSearchTerm)) ||
        (template.Tags && template.Tags.some(tag => tag.toLowerCase().includes(lowercasedSearchTerm))) ||
        (template.Description && template.Description.toLowerCase().includes(lowercasedSearchTerm))
      );
    }
    setFilteredTemplates(currentTemplates);
  }, [searchTerm, templates]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSelectCategory = (category) => {
    // This will trigger the useEffect for categoryName as well if routing is set up correctly
    // For now, we update the state directly and rely on the URL change.
    setSelectedCategory(category);
  };

  return (
    <div className="main-page-container">
      <header className="main-header">
        <img src={Logo} alt="Winc Logo" className="main-logo" />
        <h2>{selectedCategory} Category</h2>
      </header>

      <SearchBar onSearch={handleSearch} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <CategoryFilter onSelectCategory={handleSelectCategory} selectedCategory={selectedCategory} />

      <div className="special-card-prompt">
        <p>Looking for the perfect card? choose one below</p>
      </div>

      <div className="templates-grid">
        {filteredTemplates
          .filter(template => template.ThumbnailUrl || template.imageUrl)
          .map(template => (
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

      <Navbar />

      <CreateCardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        templateId={selectedTemplateId}
      />
    </div>
  );
};

export default MainCategory;
