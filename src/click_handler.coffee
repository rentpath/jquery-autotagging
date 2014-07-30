define ['jquery'], ($) ->
  class clickHandler
    constructor: (wh, opts={}) ->
      @wh = wh
      @clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img'
      if opts.exclusions?
        @clickBindSelector = @clickBindSelector.replace(/,\s+/g, ":not(#{opts.exclusions}), ")

    bindBodyClicked: (doc) ->
      $(doc).on 'click', @clickBindSelector, @elemClicked

    elemClicked: (e, options={}) =>
      domTarget = e.target
      attrs = domTarget.attributes
      jQTarget = $(e.target)

      # to handle links with internal elements, such as <span> tags.
      if !jQTarget.is(@clickBindSelector)
        jQTarget = jQTarget.parent()

      item = @wh.getItemId(jQTarget) or ''
      subGroup = @wh.getSubgroupId(jQTarget) or ''
      value = @wh.replaceDoubleByteChars(jQTarget.text()) or ''

      trackingData =
        # cg, a.k.a. contentGroup, should come from meta tag with name "WH.cg"
        sg:     subGroup
        item:   item
        value:  value
        type:   'click'
        x:      e.clientX
        y:      e.clientY

      for attr in attrs
        if attr.name.indexOf('data-') == 0 and attr.name not in @wh.exclusionList
          realName = attr.name.replace('data-', '')
          trackingData[realName] = attr.value

      # Set again here to handle elemClicked re-bindings which
      # might pass a different followHref setting
      @wh.setFollowHref(options)

      href = jQTarget.attr('href') || jQTarget.closest('a').attr('href')
      if href and @wh.followHref
        @wh.lastLinkClicked = href
        e.preventDefault()

      @wh.fire trackingData
      e.stopPropagation()

  clickHandler
