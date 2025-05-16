-- Account table

-- 1. Insert Tony Stark
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Convert to Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3 Delete Tony Stark

DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';


-- 4. Verify
SELECT * FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Inventory Table

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Use an inner join
SELECT 
    i.inv_make, 
    i.inv_model, 
    c.classification_name
FROM 
    public.inventory i
INNER JOIN 
    public.classification c
ON 
    i.classification_id = c.classification_id
WHERE 
    c.classification_name = 'Sport';

-- Update all records

UPDATE public.inventory
SET
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

