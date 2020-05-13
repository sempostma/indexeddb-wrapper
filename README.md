# indexeddb-wrapper

## Installation

```bash 
npm install --save indexeddb-wrapper
```

## Usage

```javascript
import indexeddbWrapper from 'indexeddb-wrapper'

const { myStore } = createIndexeDBWrapper({ stores: ['myStore'] }) 

myStore.set('key', 'value')
    .then(() => store.get('key'))
    .then(console.log)
```

## Warning

Use proper promise error handling to catch common errors like this:
```javascript
store.get('key').then(console.log).catch(error => {
  if (error.name === 'QuotaExceededError') {
    alert('Failed to save. Not enough storage.');
  }
  throw error;
})
```

## API

### Interface: IndexeDBWrapper

* [stores](#store)

#### stores

• **stores**: *object*

Defined in index.ts:12

### Interface: Store

* [destroy](#destroy)
* [get](#get)
* [keys](#keys)
* [purge](#purge)
* [remove](#remove)
* [set](#set)

####  destroy

• **destroy**: *function*

Defined in index.ts:8

##### Type declaration:

▸ (): *Promise‹void›*

___

####  get

• **get**: *function*

Defined in index.ts:3

##### Type declaration:

▸ (`key`: string): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

___

####  keys

• **keys**: *function*

Defined in index.ts:4

##### Type declaration:

▸ (): *Promise‹string[]›*

___

####  purge

• **purge**: *function*

Defined in index.ts:6

##### Type declaration:

▸ (): *Promise‹void›*

___

####  remove

• **remove**: *function*

Defined in index.ts:7

##### Type declaration:

▸ (`key`: string): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

___

####  set

• **set**: *function*

Defined in index.ts:5

##### Type declaration:

▸ (`key`: string, `value`: any): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

