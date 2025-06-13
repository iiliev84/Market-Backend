import db from "db/client";


// Get Review by ID 

export async function (getReviewByID) {
    const query = `
    SELECT 
    FROM reviews 
    WHERE 
    `; 

    const result = await db.query(query);
    return result.rows; 
}



// Get All Reviews by Person ID 

SELECT * 
FROM Reviews 
WHERE 

 const result = await db.query(query);
    return result.rows; 



// Get All Reviews By Product ID 




 const result = await db.query(query);
    return result.rows; 