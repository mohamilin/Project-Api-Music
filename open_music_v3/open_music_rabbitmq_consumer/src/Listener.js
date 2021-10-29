class Listener{
    constructor(songsService, mailSender){
        this._songsService = songsService,
        this._mailSender = mailSender
        this.listen = this.listen.bind(this)
    }
    
    async listen(message){
        try {
            const {playlistId, targetEmail} = JSON.parse(message.content.toString())
            const songs = await this._songsService.getSongs(playlistId)
            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(songs) )
            console.log('result queue', result)
        } catch (error) {
            console.error('pesan error', error.message)
        }
    }
}

module.exports = Listener