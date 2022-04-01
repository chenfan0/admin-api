const { createStoryService, getStoryListService } = require('../service/story.service')

class StoryController {
  async createStory(ctx, next) {
    const result = await createStoryService(ctx.request.body)
    ctx.body = {
      code: 0,
      data: result
    }
  }

  async getStoryList(ctx, next) {
    const result = await getStoryListService(ctx.request.body)
    ctx.body = result
  }
}

module.exports = new StoryController()

