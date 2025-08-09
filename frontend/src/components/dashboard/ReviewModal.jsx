import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../../context/ShopContext';

const ReviewModal = ({ item, onClose, onReviewSubmitted }) => {
    const { token, backendUrl } = useContext(ShopContext);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/review/submit`, 
                { rating, comment, reviewToken: item.reviewToken },
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success("Review submitted successfully!");
                onReviewSubmitted();
                onClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review.");
        } finally {
            setIsLoading(false);
        }
    };

    const StarRating = () => (
        <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => setRating(star)}
                      className={`text-4xl cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                <h2 className="text-2xl font-bold mb-4">Review: {item.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-medium mb-2">Your Rating</label>
                        <StarRating />
                    </div>
                    <div>
                        <label htmlFor="comment" className="block font-medium mb-2">Your Comment</label>
                        <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)}
                                  className="w-full p-2 border rounded-md" rows="4" required />
                    </div>
                    <button type="submit" disabled={isLoading || rating === 0}
                            className="w-full bg-black text-white py-2 rounded-md disabled:bg-gray-400">
                        {isLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;