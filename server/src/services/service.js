class Service {
  constructor(Model) {
    this.Model = Model;
  }

  async getAll() {
    return this.Model.find().exec();
  }

  // populate should be an object like this {key1: selected_field, k2: s_f}
  async getOneWithPopulate(id, populate) {
    let query = this.Model.findById(id);
    if (populate) {
      Object.keys(populate).forEach(k => {
        const v = populate[k];
        if (v) {
          query = query.populate(k, v);
        } else {
          query = query.populate(k);
        }
      });
    }
    return query;
  }

  async createOne(fields) {
    const document = new this.Model(fields);
    await document.save();
    return document;
  }

  // fields -> field to be updated
  async updateOne(id, fields) {
    return this.Model.findByIdAndUpdate(id, fields, {
      new: true,
      runValidators: true
    });
  }

  async deleteOne(id) {
    return this.Model.findByIdAndDelete(id);
  }
}

module.exports = Service;
