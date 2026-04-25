const { ObjectId } = require("mongodb");

class NhaXuatBanService {
    constructor(client) {
        this.NhaXuatBan = client.db().collection("nha_xuat_ban");
    }

    extractNXBData(payload) {
        const nxb = {
            ten_nxb: payload.ten_nxb,
            dia_chi: payload.dia_chi,
        };
        Object.keys(nxb).forEach(
            (key) => nxb[key] === undefined && delete nxb[key]
        );
        return nxb;
    }

    async create(payload) {
        const nxb = this.extractNXBData(payload);
        const result = await this.NhaXuatBan.insertOne(nxb);
        return result;
    }

    async find(filter) {
       
        const cursor = await this.NhaXuatBan.find(filter);
        return await cursor.toArray();
    }
}

module.exports = NhaXuatBanService;