const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const allTags = await Tag.findAll({
        include: [{ model: Product}],
    });
    res.status(200).json(allTags);
  } catch (err) {
    console.log(err),
    res.status(500).json({ message: 'Internal server error!' + err});
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const getTag = await Tag.findByPk(req.params.id, {
        include: [{ model: Product}],
    });
    if (!getTag) {
        res.status(404).json({ message: `Unable to find product with that ID!`});
    } else {
        res.status(200).json(getTag);
      }
    } catch (err) {
      res.status(500).json({message: 'Internal server error!' + err});
    }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const createTag = await Tag.create(req.body);
        res.status(201).json(createTag);
    } catch (err) {
        res.status(500).json({message: 'Internal server error!' + err});
    }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updateTag = await Tag.create(req.body, {
        where: {id: req.params.id},
    });
        res.status(201).json(updateTag);
    } catch (err) {
        res.status(500).json({message: 'Internal server error!' + err});
    }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleteTag = await Tag.findByPk(req.body, {
        where: {
            id: req.params.id,
        },
    });
    if (!deleteTag) {
    res.status(404).json({ message: `Unable to find product with that ID!`}); return;
    }
    await deleteTag.destroy();
    res.status(200).json({ message: `Tag [${deleteTag}] was deleted!`});
  } catch (err) {
    console.log(err),
    res.status(500).json({ message: 'Internal server error!' + err});
  }
});

module.exports = router;