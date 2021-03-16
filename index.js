const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   GroupSettingChange,
   waChatKey,
   mentionedJid,
   processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal") 
const moment = require("moment-timezone") 
const fs = require("fs") 
const { color, bgcolor } = require('./lib/color')
const { help } = require('./lib/help')
const { donasi } = require('./lib/donasi')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:1.0.1\n' 
            + 'FN:MR8UG Editor\n' 
            + 'ORG: Pengembang XBot;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=none\n' 
            + 'END:VCARD' 
prefix = '#'
blocked = []          

/********** LOAD FILE **************/

/********** END FILE ***************/
  
const time = moment().tz('America/Guatemala').format("HH:mm:ss")
const arrayBulan = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const bulan = arrayBulan[moment().format('MM') - 1]
const config = {
    XBOT: 'MR8UG', 
    instagram: 'https://www.instagram.com/carlos.ecampos/', 
    nomer: '<codigopais><telefonodebot>', //ingresa tu numero de telefon incluyendo el codigo de pais sin el + -> <<codigopais> 12345678>
    youtube: 'https://soundcloud.com/mr8ug/fly-day-chinatown-mr8ug-edit', 
    whatsapp: 'Comming soon', 
    tanggal: `Fecha: ${moment().format('DD')} ${bulan} ${moment().format('YYYY')}`,
    waktu: time
}

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Hora ${pad(minutes)} Minuto ${pad(seconds)} Segundo`
}


const { tanggal, waktu, instagram, whatsapp, youtube, nomer, ontime } = config



const { exec } = require("child_process")

const client = new WAConnection()

client.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ${time} ] QR generado, escanee con Whatsapp Web QR Reader...`)
})

client.on('credentials-updated', () => {
   const authInfo = client.base64EncodedAuthInfo()
   console.log(`credentials updated!`)

   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')

client.connect();

// client.on('user-presence-update', json => console.log(json.id + ' presence is => ' + json.type)) || console.log(`${time}: Bot by ig:@affis_saputro123`)

client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Hola @${num.split('@')[0]}\Bienvenido al grupo *${mdata.subject}* tome asiento...`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `En paz descanse, soldado🥳 @${num.split('@')[0]} espero vuelva.²`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('America/Guatemala').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '❬❗❭ Awanta, estoy chiquito',
				success: '️❬ ✔ ❭ Nicee 🖤',
				error: {
					stick: 'F, ya la cagué verdad?, intenta de nuevo. ',
					Iv: 'Enlace invalido'
				},
				only: {
					group: '❬❗❭ SOLO GRUPOS ',
					ownerG: '❬❗❭ SOLO JEFES ',
					ownerB: '❬❗❭  SOLO JEFES ',
					admin: '❬❗❭ SOLO ADMINS ',
					Badmin: '❬❗❭ EL BOT DEBE SER ADMIN '
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["<codigopais><tunumero>@s.whatsapp.net"] //numero de servidor
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupDesc = isGroup ? groupMetadata.desc : ''
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'puedo':
					bisakah = body.slice(1)
					const bisa =['Pues si wey no mames','Hijole no se va poder','Intenta de nuevo']
					const keh = bisa[Math.floor(Math.random() * bisa.length)]
					client.sendMessage(from, 'Pregunta : *'+bisakah+'*\n\Respuesta : '+ keh, text, { quoted: mek })
					break
				case 'cuando':
					kapankah = body.slice(1)
					const kapan =['Mañana', 'Pasado mañana', 'En un rato', '4 días más', '5 días más', '6 días más', '1 semana mas', '2 semanas más', '3 semanas más' , '1 mes más', '2 meses nuevamente', '3 meses nuevamente', '4 meses nuevamente', '5 meses nuevamente', '6 meses nuevamente', '1 año más', '2 años más', ' 3 años más ',' 4 años más ',' 5 años más ',' 6 años más ',' 1 siglo más ',' 3 días más ']
					const koh = kapan[Math.floor(Math.random() * kapan.length)]
					client.sendMessage(from, 'Pregunta : *'+kapankah+'*\n\Respuesta : '+ koh, text, { quoted: mek })
					break
				case 'sinotalvez':
					apakah = body.slice(1)
					const apa =['Si','No','Puede ser','Prueba de nuevo']
					const kah = apa[Math.floor(Math.random() * apa.length)]
					client.sendMessage(from, 'Pregunta : *'+apakah+'*\n\Respuesta : '+ kah, text, { quoted: mek })
					break
				case 'probabilidad':
					rate = body.slice(1)
					const ra =['4','9','17','28','34','48','59','62','74','83','97','100','29','94','75','82','41','39']
					const te = ra[Math.floor(Math.random() * ra.length)]
					client.sendMessage(from, 'Pregunta : *'+rate+'*\n\Respuesta : '+ te+'%', text, { quoted: mek })
					break
				case 'speed':
				case 'ping':
					await client.sendMessage(from, `Pong!!!!\nSpeed: ${processTime(t, moment())} _Second_`)
					break
				case 'help': 
				case 'menu':
					client.sendMessage(from, help(prefix), text)
					break
				case 'donasi':
				case 'donate':
					client.sendMessage(from, donasi(), text)
					break
				
				case 'info':
					me = client.user
					uptime = process.uptime()
					teks = `*Nombre de BOT* : ${me.name}\n*OWNER* : *MR8UG*\n*AUTHOR* : MR8UG\n*Numero de BOT* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Total Block Contact* : ${blocked.length}\n*El bot esta activo* : ${kyun(uptime)}`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
				case 'blocklist': 
					teks = '𝗕𝗟𝗢𝗖𝗞 𝗟𝗜𝗦𝗧 :\n'
					for (let block of blocked) {
						teks += `┣➢ @${block.split('@')[0]}\n`
					}
					teks += `𝗧𝗼𝘁𝗮𝗹 : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
                case 'hidetag':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply('De quien eres?')
					var value = body.slice(9)
					var group = await client.groupMetadata(from)
					var member = group['participants']
					var mem = []
					member.map( async adm => {
					mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
					})
					var options = {
					text: value,
					contextInfo: { mentionedJid: mem },
					quoted: mek
					}
					client.sendMessage(from, options, text)
					break
                case 'quotemaker':
					var gh = body.slice(12)
					var quote = gh.split("|")[0];
					var wm = gh.split("|")[1];
					//var bg = gh.split("|")[2];
					var bg='random';
					const pref = `Uso: \n${prefix}quotemaker texto|autor\n\nEx :\n${prefix}quotemaker texto|autor|random`
					if (args.length < 1) return reply(pref)
					reply(mess.wait)
					anu = await fetchJson(`https://terhambar.com/aw/qts/?kata=${quote}&author=${wm}&tipe=${bg}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {caption: '', quoted: mek})
					break
                 
                case 'verdad':
					const trut =['¿Qué es lo que más miedo te da? ¿Por qué?','¿Alguna vez has engañado a tu pareja?','¿Has hecho una escena ridícula en un parque?','¿Has conducido borracho alguna vez?','¿Has estafado a alguien?','¿Has robado algo alguna vez?','¿Has estado en una comisaría detenido alguna vez?','¿Alguna vez has hablado contigo mismo en voz alta?','¿Has escuchado o visto algo que no existe?','¿Has tenido la sensación de no estar solo cuando no hay nadie más en la habitación? ¿Cuándo?','¿Has mentido alguna vez? ¿Cuál ha sido la mentira más elaborada que has dicho y porque tuviste que hacerlo?','¿Te han humillado alguna vez? ¿Cuándo?','¿Has hecho trampa en la escuela alguna vez?','¿Te ha gustado alguno de los profesores de la escuela? ¿Cuál?','¿Te has escapado de clases en alguna oportunidad?','¿Cómo crees que será la boda de tus sueños?','¿Cuál es tu película favorita y por qué?','¿Cuál es la parte de tu cuerpo que más te gusta? ¿Y la que menos te gusta?','¿Qué es lo que te molesta de tu pareja?','El chico que te gusta te ha invitado a salir. ¿A dónde te gustaría ir por primera vez?','¿Cuál es el mayor tiempo que has estado sin bañarte y por qué razón?','¿Cuál es el mayor tiempo que has estado sin bañarte y por qué razón?','¿Cuál ha sido el mejor sueño que has tenido dormido? ¿Y despierto?','¿Qué cosas de niño pequeño aún haces?','¿Qué cosas más te molestan de tus padres?','¿Cuál ha sido la anécdota más absurda que te han contado tus abuelos?','¿Cuál es tu comida preferida y quién la ha preparado?','¿Cuál es la parte del cuerpo que miras en alguien del sexo opuesto?','¿Quién es tu cantante favorito?','¿Qué cambiarías de tu aspecto físico?','¿Qué película de Pixar o Disney es tu favorita y por qué?','¿Cuál es el primer recuerdo de tu infancia?','¿Cuál es el mejor recuerdo de tu vida?','¿Cuál es tu mayor secreto?','¿Qué edad tenías cuando diste tu primer beso?','¿Cambiarías de novio o novia por 1 millón de dólares?','¿En qué condiciones le mentirías a tu mejor amigo?','¿Alguna vez has dicho una mentira mientras jugabas a “verdad o reto”? ¿Cuál?','¿Podrías estar una semana sin tu celular?','¿Qué ha sido lo más horrible que has dicho en público?','¿Te has extraviado alguna vez de niño?','¿Qué se lo peor que has hecho en tu vida?','¿Qué es lo más loco que has hecho sin que tus padres se enteren?','¿Qué es en lo primero que piensas cuando te despiertas?','¿Qué es lo último que piensas por las noches?','¿Has ayudado a alguien sin conocerlo alguna vez?','¿Qué harías si ganaras la lotería hoy mismo?','¿Qué harías si te enteraras de que te queda una semana de vida?','Si fueras invisible, ¿a dónde irías?','Si pudieras volar, ¿a dónde viajarías?','Si pudieras viajar en el tiempo, ¿a dónde irías? ¿y en el espacio?','¿Cuánto tiempo has tardado en comer un plato de comida muy desagradable y quién te lo ha preparado?','¿Qué comida te produce náuseas?','¿Qué harías si te enteras de que el niño que te gusta se mudará la semana entrante a otro país?','¿Cómo reaccionarías si mañana suspenden las clases para siempre?','Si te enteras de que morirás mañana, ¿a quién visitarías y qué le dirías?','Si pudieras hablar con algún familiar que ha fallecido, ¿qué le preguntarías?','¿Cómo reaccionarías si encontraras mucho dinero en la calle pero con los datos del dueño para devolverlo?','¿Quién ha sido el peor profesor y por qué?','¿Qué actor o cantante famoso te parece lindo y por qué?','Entre los presentes, ¿quién te parece lindo y por qué?']
					const ttrth = trut[Math.floor(Math.random() * trut.length)]
					truteh = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
					client.sendMessage(from, truteh, image, { caption: '*Verdad*\n\n'+ ttrth, quoted: mek })
					break
				case 'reto':
					const dare =['ya la cague verdad?']
					const der = dare[Math.floor(Math.random() * dare.length)]
					tod = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
					client.sendMessage(from, tod, image, { quoted: mek, caption: '*Reto*\n\n'+ der })
					break				
				case 'waifu':
				   anu = await fetchJson(`https://arugaz.herokuapp.com/api/waifu`)
				   buf = await getBuffer(anu.image)
				   texs = ` *Nombre de Anime* : ${anu.name} \n*Descripcion* : ${anu.desc} \n*Fuente* : ${anu.source}`
				   client.sendMessage(from, buf, image, { quoted: mek, caption: `${texs}`})
					break
				
                case 'kawaii':
                    anu = await fetchJson(`https://arugaz.herokuapp.com/api/nekonime` , {method: 'get'})
                    buf = await getBuffer(anu.result)
                    client.sendMessage(from, buf, image, { quoted: mek, caption: 'uwu'})
                	break
                
                case 'bug':
                     const pesan = body.slice(5)
                      if (pesan.length > 300) return client.sendMessage(from, 'Mucho texto... Maximo 300 caracteres', msgType.text, {quoted: mek})
                        var nomor = mek.participant
                       const teks1 = `*[REPORT]*\nNomor : @${nomor.split("@s.whatsapp.net")[0]}\nPesan : ${pesan}`
                      var options = {
                         text: teks1,
                         contextInfo: {mentionedJid: [nomor]},
                     }
                    client.sendMessage('<codigopais><telefonodebot>@s.whatsapp.net', options, text, {quoted: mek})
                    reply('Se han informado problemas al propietario del Bot, no se respondera a los informes falsos.')
                    break
                
				
				case 'qrmaker':
					if (args.length < 1) return reply('Y el texto? .-.')
                    teks = `${body.slice(9)}`
                    //if (teks.length > 10) return client.sendMessage(from, 'Mucho texto, maximo 10 letras', text, {quoted: mek})
                    buff = await getBuffer(`https://docs-jojo.herokuapp.com/api/qrcode?text=${teks}`, {method: 'get'})
                    client.sendMessage(from, buff, image, {quoted: mek, caption: `${teks}`})
			     	
					break
				
                case 'lyric':
                    if (args.length < 1) return reply('Y el titulo de la cancion?')
                    teha = body.slice(7)
                    anu = await fetchJson(`https://arugaz.herokuapp.com/api/lirik?judul=${teha}` , {method: 'get'})
                    reply(anu.result)
                	break
                case 'pokemon':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=pokemon`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
                case 'mascota':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=anjing`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
                case 'spamcall':
					if (args.length < 1) return ('Ingrese el numero de destino')
					weha = body.slice(10)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamcall?no=${weha}` , {method: 'get'})
					client.sendMessage(from, anu.logs, text, {quoted: mek})
					break
					 
				case 'ytmp4':
					if (args.length < 1) return reply('Y el zelda del vidio? .-.')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {mimetype: 'video/mp4', filename: `${anu.title}.mp4`, quoted: mek})
					break
				case 'ytmp3':
					if (args.length < 1) return reply('Y el zelda del vidio? .-.')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/ytmp3?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mpeg', filename: `${anu.title}.mp3`, quoted: mek})
					break

				case 'dltiktok':
					if(args.length<1) return reply('Y el zelda de tiktok? .-. ')
					if (!isUrl(args[0]) && !args[0].includes('tiktok')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/tiktok_nowm?url=${args[0]}`, {method:'get'})
					if (anu.error) return reply(anu.error)
					teks=`*Title* : ${anu.from}`
					buffer = await getBuffer(anu.result[1])
					client.sendMessage(from,buffer,video,{mimetype: 'video/mp4', filename:`${anu.from}.mp4`,quoted:mek})
					break;

                case 'text3d':
              	    if (args.length < 1) return reply('Y el texto? .-.')
                    teks = `${body.slice(8)}`
                    //if (teks.length > 10) return client.sendMessage(from, 'Mucho texto, maximo 10 letras', text, {quoted: mek})
                    buff = await getBuffer(`https://docs-jojo.herokuapp.com/api/text3d?text=${teks}`, {method: 'get'})
                    client.sendMessage(from, buff, image, {quoted: mek, caption: `${teks}`})
			     	break
				
				case 'shorturl':
					if (args.length < 1) return reply('y el texto?')
					if(!isUrl(args[0]) ) return reply(mess.error.Iv)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/shorturl-at?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					//buffer = await getBuffer(anu.result)
					reply(anu.result)
					break
                
				case 'web2pdf':
					if (args.length < 1) return reply('y el texto?')
					if(!isUrl(args[0]) ) return reply(mess.error.Iv)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/shorturl-at?url=https://docs-jojo.herokuapp.com/api/ssweb_pdf?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					//buffer = await getBuffer(anu.result)
					//client.sendMessage(from, 'PDF: https://docs-jojo.herokuapp.com/api/ssweb_pdf?url='+args[0], text, {quoted: mek})
					reply(anu.result)
					break
                case 'wikipedia':
				case 'wiki':
					if (args.length <1) return reply('Que deseas wikibuscar?')
					//if(!isUrl(args[0]) ) return reply(mess.error.Iv)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/wiki?q=${args[0]}`,{method: 'get'})
					if (anu.error) return reply(anu.error)
					reply(anu.result)
					break



				case 'ocr': 
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Enviar foto con description ${prefix}𝗼𝗰𝗿')
					}
					break
				case 'stiker': 
				case 'sticker':
				case 's':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Incio : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Terminado')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`F, vuelve a intentarlo`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
							} else {
						reply(`Enviar imagen con texto ${prefix}sticker como respuesta o etiqueta de imagen`)
					}
					break
				case 'getses':
					if (!isOwner) return reply(mess.only.ownerB)
						const sesPic = await client.getSnapshot()
						client.sendFile(from, sesPic, 'session.png', '^_^...', id)
					break	
				case 'gtts':	
				case 'tts':
					if (args.length < 1) return client.sendMessage(from, 'Codigo de idioma necesario', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, 'Cual es el texto que quieres que diga?', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 300
					? reply('Chucha tampoco tan largo bro😤')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('F, vuelve a intentarlo')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`Prefijo cambiado correctamente: ${prefix}`)
					break 
				
				case 'tiktokstalker':
					try {
						if (args.length < 1) return client.sendMessage(from, 'y el usuario ?', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*Id* : ${user.id}\n*Usuario* : ${user.uniqueId}\n*Sobrenombre* : ${user.nickname}\n*Seguidores* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Likes* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('[𝗘𝗥𝗥𝗢𝗥] Se me hace que te equivocaste de usuario...')
					}
					break
				
				case 'linkgc':
				    if (!isGroup) return reply(mess.only.group)
				    if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				    linkgc = await client.groupInviteCode (from)
				    yeh = `https://chat.whatsapp.com/${linkgc}\n\nLink de Grupo *${groupName}*`
				    client.sendMessage(from, yeh, text, {quoted: mek})
			        break
				case 'tagall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `┣➥ @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
				case 'clearall':
					if (!isOwner) return reply(' *De quien eres?* ?')
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('Clear all exitoso  :)')
					break
				case 'block':
					client.updatePresence(from, Presence.composing) 
					client.chatRead (from)
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					client.blockUser (`${body.slice(7)}@c.us`, "add")
					client.sendMessage(from, `Orden recibida, bloqueado ${body.slice(7)}@c.us`, text)
					break
				case 'unblock':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
				    client.blockUser (`${body.slice(9)}@c.us`, "remove")
					client.sendMessage(from, `Orden recibida, abierto ${body.slice(9)}@c.us`, text)
					break
				case 'leave': 
				if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
				await client.leaveGroup(from, 'Adiooos!', groupId)
                    break
				case 'bc': 
					if (!isOwner) return reply(' De quien eres ?') 
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `< MENSAJE DE DIFUSION >\n\n${body.slice(4)}`})
						}
						reply('Transmision exitosa ')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `< MENSAJE DE DIFUSION >\n\n${body.slice(4)}`)
						}
						reply('Transmision exitosa ')
					}
					break
			   	case 'setpp': 
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					media = await client.downloadAndSaveMediaMessage(mek)
					await client.updateProfilePicture (from, media)
					reply('Reemplazo de icono de grupo exitoso')
					break						
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Quieres agregar a alguien?')
					if (args[0].startsWith('08')) return reply('Agregue el codigo de pais [+<codigopais>] ')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('No se pudo agregar, talvez tiene cuenta privada')
					}
					break
					case 'grup':
					case 'group':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args[0] === 'buka') {
					    reply(`Grupo abierto`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, false)
					} else if (args[0] === 'tutup') {
						reply(`Grupo cerrado`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, true)
					}
					break
                    
				case 'admin':
				case 'owner':
				case 'creator':
					client.sendMessage(from, {displayname: "ELJEFE", vcard: vcard}, MessageType.contact, { quoted: mek})
					client.sendMessage(from, 'Este es mi numero, no te envie spam ni te bloquee',MessageType.text, { quoted: mek} )
					break    
				case 'setname':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					client.groupUpdateSubject(from, `${body.slice(9)}`)
					client.sendMessage(from, 'EXITO, cambio de nombre de grupo', text, {quoted: mek})
					break
					case 'setdesc':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					client.groupUpdateDescription(from, `${body.slice(9)}`)
					client.sendMessage(from, 'EXITO, cambio de descripcion de grupo', text, {quoted: mek})
					break
				case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Etiqueta al usuario a degradar!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `Hijole ya no eres admin🏃 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					} else {
						mentions(`𝘆𝗮𝗵𝗵 @${mentioned[0].split('@')[0]} puesto de admin eliminado.🏃`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Etiqueta al usuario a promover!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `Ulala ascendieron a admin de grupo (+_+) :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					} else {
						mentions(`𝗦𝗲𝗹𝗮𝗺𝗮𝘁🥳 @${mentioned[0].split('@')[0]} Ulala ascendieron a admin de grupo (+_+)`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break	
			     	case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Etiqueta al usuario a kickear!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `Vayase a la chingada 🏃 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Saquese de aqui @${mentioned[0].split('@')[0]} 🏃`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'listadmin':
					if (!isGroup) return reply(mess.only.group)
					teks = `Listar Administradores de Grupo *${groupMetadata.subject}*\n𝗧𝗼𝘁𝗮𝗹 : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('Respuesta/Etiqueta sticker')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('F, intenta de nuevo')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'duh '})
						fs.unlinkSync(ran)
					})
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Boo :𝘃')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('𝘀𝘂𝗱𝗮𝗵 𝗮𝗸𝘁𝗶𝗳 !!!')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('( EXITO ) Activar funcion de SIMI en el grupo')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('( EXITO ) Desactivar funcion de SIMI en el grupo')
					} else {
						reply(' *Escriba el comando 1 para activar , 0 para desactivar* \n𝗰𝗼𝗻𝘁𝗼𝗵: 𝘀𝗶𝗺𝗶𝗵 𝟭')
					}
					break
				case 'nsfw':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Boo :𝘃')
					if (Number(args[0]) === 1) {
						if (isNsfw) return reply('esta activo??𝗳 !!')
						nsfw.push(from)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('❬ EXITO ❭ Activar funcion NSFW en el grupo')
					} else if (Number(args[0]) === 0) {
						nsfw.splice(from, 1)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('❬ EXITO ❭ Desactivar funcion NSFW en el grupo')
					} else {
						reply(' *Escriba el comando 1 para activar , 0 para desactivar* \n𝗰𝗼𝗻𝘁𝗼𝗵: 𝗻𝘀𝗳𝘄 𝟭')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Boo :𝘃')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('Activado !!!')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('❬ EXITO ❭ Activar mensaje de bienvenida/salida del grupo')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('❬ EXITO ❭ Desactivar mensaje de bienvenida/salida del grupo')
					} else {
						reply(' *Ketik perintah 1 untuk mengaktifkan, 0 untuk menonaktifkan* \n *Contoh: ${prefix}welcome 1*')
					}
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(' *LU SIAPA* ?') 
					if (args.length < 1) return reply(' *TAG YANG MAU DI CLONE!!!* ')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`La foto de perfil se actualizo correctamente con la foto de perfil de @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply(' *Yah gagal ;(, coba ulangi ^_^* ')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply(' *Enviando Fotos con CAPTIO OCR* ')
					}
					break
				default:
					if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), 'Commando sinRegistro: ', color(sender.split('@')[0]))
					}
					break
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
