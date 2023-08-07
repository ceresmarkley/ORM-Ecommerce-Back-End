const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const allProducts = await Product.findAll({
        include: [{ model: Category}, {model: Tag}],
    });
    res.status(200).json(allProducts);
  } catch (err) {
    console.log(err),
    res.status(500).json({ message: 'Internal server error!' + err});
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const getProduct = await Product.findByPk(req.params.id, {
        include: [{ model: Category}, {model: Tag}],
    });
    if (!getProduct) {
        res.status(404).json({ message: `Unable to find product with that ID!`});
    } else {
        res.status(200).json(getProduct);
      }
    } catch (err) {
      res.status(500).json({message: 'Internal server error!' + err});
    }
  });

// create new product
router.post ('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
 try {

    const { product_name, price, stock, tagIds } = req.body;

    if (!product_name || !price || !stock) {
     return res.status(400).json({message: 'Invalid Request! Must have a Product Name, Price and Stock inputs!'})   
    }

    const createProduct = await Product.create({product_name, price, stock});

    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: createProduct.id,
            tag_id,
          };
        });
    await ProductTag.bulkCreate(productTagIdArr);
    }
      // if no product tags, just respond
      res.status(201).json(createProduct);
    } catch (err) {
        console.log(err),
        res.status(500).json({ message: 'Internal server error!' + err});
    }
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deleteProduct = await Product.findByPk(req.params.id);
    if (!deleteProduct) {
    res.status(404).json({ message: `Unable to find product with that ID!`}); return;
    }
    await deleteProduct.destroy();
    res.status(200).json({ message: `Product [${req.params.id}] was deleted!`});
  } catch (err) {
    console.log(err),
    res.status(500).json({ message: 'Internal server error!' + err});
  }
});

module.exports = router;