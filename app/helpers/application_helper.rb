module ApplicationHelper
  def extra_stylesheet(stylesheet = controller_name)
    content_for :extra_stylesheet do
      stylesheet_link_tag stylesheet, :media => 'all'
    end
  end
end
