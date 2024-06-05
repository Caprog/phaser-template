const observe = (data, notifyChange) => {
  const isObject = value => value && typeof value === 'object'

  const createProxy = (target, path = []) => {
    const handler = {
      get(target, property, receiver) {
        const value = Reflect.get(target, property, receiver)
        if (isObject(value) && !value.__isProxied) {
          value.__isProxied = true
          return createProxy(value, path.concat(property))
        }
        return value
      },
      set(target, property, value, receiver) {
        const oldValue = target[property]
        if (oldValue !== value) {
          notifyChange('set', path.concat(property), value, oldValue)
          const result = Reflect.set(
            target, 
            property, 
            isObject(value) ? createProxy(value, path.concat(property)) : value, 
            receiver
          )
          return result
        }
        return true
      },
      deleteProperty(target, property) {
        if (property in target) {
          const oldValue = target[property]
          notifyChange('delete', path.concat(property), undefined, oldValue)
          return Reflect.deleteProperty(target, property)
        }
        return false
      }
    }
    return new Proxy(target, handler)
  }

  return createProxy(data)
}


const obj = observe({
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    zip: '10001'
  },
  hobbies: ['reading', 'sports']
}, (...data) => console.log(obj));

obj.name = 'Jane'; // Cambio en propiedad
obj.age = 31; // Cambio en propiedad
obj.address.city = 'Los Angeles'; // Cambio en propiedad anidada
obj.hobbies.push('music'); // Cambio en arreglo
delete obj.address.zip; // Eliminación de propiedad anidada