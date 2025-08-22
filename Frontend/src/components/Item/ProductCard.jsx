import React from 'react';
import { Calendar, Tag, User, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
    const {
        _id,
        itemName,
        price,
        category,
        owner,
        createdAt,
        condition,
        images
    } = product;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    const imageUrl = (images && images.length > 0) ? images[0] : 'https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image&font=sans';

    return (
        <Link to={`/product/${_id}`} className="block group overflow-hidden">
            {/* --- THEME CHANGE IS HERE --- */}
            <div className="bg-white rounded-xl shadow-lg shadow-blue-500/5 border border-gray-100 flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={itemName}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x300/E2E8F0/4A5568?text=Error&font=sans'; }}
                    />
                    {/* Themed Condition Badge */}
                    {condition && (
                        <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                            {condition}
                        </span>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Category */}
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2 flex items-center">
                        <Tag size={14} className="mr-1.5" /> {category?.replaceAll('"', '') || 'General'}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug flex-grow" title={itemName?.replaceAll('"', '')}>
                        {itemName?.replaceAll('"', '')}
                    </h3>

                    {/* Price */}
                    <p className="text-2xl font-extrabold text-green-600 mb-4 flex items-center">
                        <IndianRupee size={20} className="mr-0.5"/>
                        {price?.toLocaleString('en-IN') || 'N/A'}
                    </p>

                    {/* Meta Info (Pushed to Bottom) */}
                    <div className="mt-auto text-xs text-gray-500 space-y-2 pt-4 border-t border-gray-100">
                        <p className="flex items-center">
                            <User size={14} className="mr-1.5 text-gray-400"/>
                            <span className="font-medium">Seller:</span>&nbsp;{owner?.fullname || 'Anonymous'}
                        </p>
                        <p className="flex items-center">
                            <Calendar size={14} className="mr-1.5 text-gray-400"/>
                            <span className="font-medium">Posted:</span>&nbsp;{formatDate(createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
