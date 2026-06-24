const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                        Previous
                    </button>
                </li>

                {pages.map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(page)}>
                            {page + 1}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;