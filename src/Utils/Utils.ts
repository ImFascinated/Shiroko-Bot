import { GuildMember, Message } from 'discord.js';

export default class Utils {
	constructor() { }

	hasRole(member: GuildMember, roleName: string): boolean {
		let hasRole = false;
		member.roles.cache.forEach(role => {
			if (role.name === roleName) {
				hasRole = true;
			}
		});
		return hasRole;
	}

	formatTime(milliseconds: number, minimal: boolean = false): string {
		if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0) {
			return "00:00";
			//throw new RangeError("Utils#formatTime(milliseconds: number) Milliseconds must be a number greater than 0");
		}

		if (typeof minimal !== "boolean") {
			return "00:00";
			//throw new RangeError("Utils#formatTime(milliseconds: number, minimal: boolean) Minimal must be a boolean");
		}

		const times = {
			years: 0,
			months: 0,
			weeks: 0,
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		};

		while (milliseconds > 0) {
			if (milliseconds - 31557600000 >= 0) {
				milliseconds -= 31557600000;
				times.years++;
			} else if (milliseconds - 2628000000 >= 0) {
				milliseconds -= 2628000000;
				times.months++;
			} else if (milliseconds - 604800000 >= 0) {
				milliseconds -= 604800000;
				times.weeks += 7;
			} else if (milliseconds - 86400000 >= 0) {
				milliseconds -= 86400000;
				times.days++;
			} else if (milliseconds - 3600000 >= 0) {
				milliseconds -= 3600000;
				times.hours++;
			} else if (milliseconds - 60000 >= 0) {
				milliseconds -= 60000;
				times.minutes++;
			} else {
				times.seconds = Math.round(milliseconds / 1000);
				milliseconds = 0;
			}
		}

		const finalTime: string[] = [];
		let first = false;

		for (const [k, v] of Object.entries(times)) {
			if (minimal) {
				if (v === 0 && !first) {
					continue;
				}
				finalTime.push(v < 10 ? `0${v}` : `${v}`);
				first = true;
				continue;
			}
			if (v > 0) {
				finalTime.push(`${v} ${v > 1 ? k : k.slice(0, -1)}`);
			}
		}

		if (minimal && finalTime.length === 1) {
			finalTime.unshift("00");
		}

		let time = finalTime.join(minimal ? ":" : ", ");

		if (time.includes(",")) {
			const pos = time.lastIndexOf(",");
			time = `${time.slice(0, pos)} and ${time.slice(pos + 1)}`;
		}

		return time;
	}

	async getTarget(message: Message, arg: string): Promise<GuildMember | undefined> {
		if (message.guild == null) return undefined;

		const messageMentions = message.mentions.members;
		if (messageMentions?.first() !== undefined) {
			return messageMentions.first();
		}
		const targetById = await message.guild.members.fetch(arg);
		if (targetById) {
			return targetById;
		}
		return undefined;
	}

	formatBytes(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}

	objectToMap = (obj: any) => {
		const keys = Object.keys(obj);
		const map = new Map();
		for (let i = 0; i < keys.length; i++) {
			//inserting new key value pair inside map
			map.set(keys[i], obj[keys[i]]);
		};
		return map;
	};

	// objectToMap(obj: any) {
	// 	const mp = new Map();
	// 	console.log(`--------------------------------`)
	// 	console.log(obj)
	// 	Object.keys(obj).forEach((k) => {
	// 		mp.set(k, obj[k]);
	// 		console.log(k)
	// 	});
	// 	console.log(`--------------------------------`)
	// 	return mp;
	// };
}
