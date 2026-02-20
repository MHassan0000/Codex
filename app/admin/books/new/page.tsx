import BookForm from "@/components/admin/BookForm";

const NewBookPage = () => {
    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Create a New Book</h2>
                    <p className="admin-page-count">
                        Fill in the details below to add a new book to the library
                    </p>
                </div>
            </div>

            <div className="admin-form-container">
                <BookForm />
            </div>
        </div>
    );
};

export default NewBookPage;
