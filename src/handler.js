const {nanoid} = require('nanoid');
const books = require('./books');

// Kriteria 3: API dapat menyimpan buku.
const addBookHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const finished = pageCount === readPage;
    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, finished, id, insertedAt, updatedAt,
    };
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
};

// Kriteria 4: API dapat menampilkan seluruh buku.
const getAllBooksHandler = () => ({
    status: 'success',
    data: {
        books,
    },
});

// Kriteria 5: API dapat menampilkan detail buku.
const getBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if(book !== undefined){
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Kriteria 6: API dapat mengubah data buku.
const editBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if(index !== -1){
        if(name === undefined){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }

        if(readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

        books[index] = {
            ...books[index],
            name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Kriteria 7: API dapat menghapus buku.
const deleteBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const index = books.findIndex((book) => book.id === id);

    if(index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};