const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
// canvas.height = 576
canvas.height = 800

c.fillStyle = 'white'
c.fillRect(0,0, canvas.width, canvas.height)

const image = new Image()
image.src = './img/Naxos_town.png'

image.onload = () => {
    c.drawImage(image, -1400 , -200)
}
