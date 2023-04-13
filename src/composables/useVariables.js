export default function useVariables () {
  const iconBinsBase = [
    {
      color: 'black',
      position: '4',
      name: 'Indiferenciado'
    },
    {
      color: 'yellow-8',
      position: '3',
      name: 'Embalagens'
    },
    {
      color: 'blue-7',
      position: '2',
      name: 'Papel'
    }
  ]

  const iconBinsBaseBio = [
    {
      color: 'black',
      position: '4',
      name: 'Indiferenciado'
    },
    {
      color: 'yellow-8',
      position: '3',
      name: 'Embalagens'
    },
    {
      color: 'blue-7',
      position: '2',
      name: 'Papel'
    },
    {
      color: 'brown-5',
      position: '0',
      name: 'Biorresíduos'
    }
  ]

  const iconBinsBaseGlass = [
    {
      color: 'black',
      position: '4',
      name: 'Indiferenciado'
    },
    {
      color: 'yellow-8',
      position: '3',
      name: 'Embalagens'
    },
    {
      color: 'blue-7',
      position: '2',
      name: 'Papel'
    },
    {
      color: 'green-6',
      position: '1',
      name: 'Vidro'
    }
  ]

  const iconBinsExtra = [
    {
      color: 'green-6',
      position: '1',
      name: 'Vidro'
    },
    {
      color: 'brown-5',
      position: '0',
      name: 'Biorresíduos'
    }
  ]

  const iconBins = [
    {
      color: 'black',
      position: '4',
      name: 'Indiferenciado'
    },
    {
      color: 'yellow-8',
      position: '3',
      name: 'Embalagens'
    },
    {
      color: 'blue-7',
      position: '2',
      name: 'Papel'
    },
    {
      color: 'green-6',
      position: '1',
      name: 'Vidro'
    },
    {
      color: 'brown-5',
      position: '0',
      name: 'Biorresíduos'
    }
  ]

  const getEcoIslandBins = (cond) => {
    if (cond === undefined) {
      return iconBinsBase
    }
    switch (cond) {
      case '11':
        return iconBins
      case '10':
        return iconBinsBaseBio
      case '01':
        return iconBinsBaseGlass
      default:
        return iconBinsBase
    }
  }

  return {
    iconBins,
    iconBinsBase,
    getEcoIslandBins,
    iconBinsExtra
  }
}
