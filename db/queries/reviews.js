import db from "db/client";


// Get Review by ID 

export async function (getReviewByID) {
    const query = `
    SELECT *
    FROM reviews 
    WHERE id = $1
    `; 

    const result = await db.query(query);
    return result.rows; 
}



// Get All Reviews by Person ID 

export async function (getReviewsByPerson) {
    const query = `
    SELECT * 
    FROM reviews 
    WHERE reviewSubmitter 
}



// Get All Reviews By Product ID 




 const result = await db.query(query);
    return result.rows; 