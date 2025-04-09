// src/components/ProductCard.jsx
import React from 'react';
import { Calendar, Tag, User, IndianRupee } from 'lucide-react'; // Using icons
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

function ProductCard({ product }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        } catch (e) {
            return dateString; // Fallback if date is invalid
        }
    };

    return (
        <Link to={`/product/${product.id}`} className="block group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition duration-300 ease-in-out hover:shadow-xl transform hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/350x250/cccccc/999999?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110" // Added group-hover effect (needs group class on parent if desired)
                />
                 {/* Optional: Condition Badge */}
                 {product.condition && (
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        {product.condition}
                    </span>
                 )}
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1 flex items-center">
                    <Tag size={14} className="mr-1 text-blue-500" /> {product.category}
                </p>

                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-snug truncate" title={product.name}>
                    {product.name}
                </h3>

                 {/* Price */}
                <p className="text-2xl font-bold text-green-600 mb-3 flex items-center">
                    <IndianRupee size={20} className="mr-1"/>{product.price.toLocaleString('en-IN')}
                </p>

                {/* Meta Info (Pushed to Bottom) */}
                <div className="mt-auto text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                    <p className="flex items-center">
                        <User size={14} className="mr-1.5 text-gray-400"/> Seller: {product.seller || 'Anonymous'}
                    </p>
                    <p className="flex items-center">
                        <Calendar size={14} className="mr-1.5 text-gray-400"/> Posted: {formatDate(product.postedDate)}
                    </p>
                </div>

                {/* Optional: View Details Button */}
                {/* <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-300">
                    View Details
                </button> */}
            </div>
            </div>
        </Link>
       
    );
}

export default ProductCard;