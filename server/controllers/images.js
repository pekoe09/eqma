const imagesRouter = require('express').Router()
const AWS = require('aws-sdk')
const Image = require('../models/image')
const config = require('../utils/config')

imagesRouter.get('/:id', async (req, res) => {
  const image = await Image.findById(req.params.id)
  if(!image || (!image.isPublic && !req.user)) {
    return res.status(400).json({error: 'image cannot be found'})
  }

  // get AWS bucket, query image from bucket
  AWS.config.accessKeyId = config.awsAccessKeyId
  AWS.config.secretAccessKey = config.awsSecretAccessKey,
  AWS.config.region = config.awsRegion
  const bucket = new AWS.S3({
    params: {
      Bucket: config.s3Bucket,
      Key: image.mainImageKey
    }
  })

  const imageBytes = bucket.getObject({
    Bucket: bucket
  })

})

imagesRouter.post('/', async (req, res) => {

})

imagesRouter.delete('/:id', async (req, res) => {

})

module.exports = imagesRouter