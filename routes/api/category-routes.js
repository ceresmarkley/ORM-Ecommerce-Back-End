const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const getCategories = await Category.findAll({
        include: [{ model: Product}],
    });
    res.status(200).json(getCategories);
  } catch (err) {
    console.log(err),
    res.status(500).json({ message: 'Internal server error!' + err});
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const getCategories = await Category.findByPk(req.params.id, {
        include: [{ model: Product}],
    });
    res.status(200).json(getCategories);
  } catch (err) {
    console.log(err),
    res.status(500).json({ message: 'Internal server error!' + err});
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
    console.log("New Category ", newCategory, "Created!");
  } catch (err) {
    console.log(err),
    res.status(500).json({ message: 'Internal server error!' + err});
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updateCategory = await Category.update(req.body, {
        where: {
            id: req.params.id,
        },
    });
    if (updateCategory[0] === 0) {
    res.status(404).json({ message: `Unable to find category with that ID!`}); return;
    }
    res.status(200).json({ message: `Category [${updateCategory}] was updated!`});
  } catch (err) {
    console.log(err),
    res.status(500).json({ message: 'Internal server error!' + err});
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deleteCategory = await Category.destroy({
        where: {
            id: req.params.id,
        },
    });
    if (!deleteCategory) {
    res.status(404).json({ message: `Unable to find category with that ID!`}); return;
    }
    res.status(200).json({ message: `Category [${req.params.id}] was deleted!`});
  } catch (err) {
    console.log(err),
    res.status(500).json({ message: 'Internal server error!' + err});
  }
});

module.exports = router;